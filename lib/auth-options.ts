import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { MOCK_USERS, isMockLoginEnabled } from "@/lib/dev-auth";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      // Development-only test accounts (never active in production)
      if (isMockLoginEnabled()) {
        const mock = MOCK_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );
        if (mock) {
          return { id: mock.id, email: mock.email, name: mock.name, role: mock.role };
        }
      }

      await dbConnect();

      const user = await User.findOne({ email: credentials.email }).select("+password");

      if (!user || !user.password) {
        return null;
      }

      const isValid = await bcrypt.compare(credentials.password, user.password);

      if (!isValid) {
        return null;
      }

      await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.avatar,
        role: user.role,
      };
    },
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  }),
];

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      // Google OAuth sign-in: create or link the user record
      if (account?.provider === "google" && profile) {
        try {
          await dbConnect();
          const email = (profile as any).email;
          const name = (profile as any).name || email?.split("@")[0] || "User";
          const googleId = (profile as any).sub || (profile as any).id;
          const picture = (profile as any).picture || (profile as any).image;

          if (!email || !googleId) {
            console.error("Missing Google profile fields:", { email, googleId });
            return token;
          }

          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            dbUser = await User.create({
              name,
              email,
              googleId,
              avatar: picture,
              role: "user",
            });
          } else if (!dbUser.googleId) {
            dbUser.googleId = googleId;
            if (picture && !dbUser.avatar) dbUser.avatar = picture;
            await dbUser.save();
          }

          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.image = dbUser.avatar || picture;
        } catch (err: any) {
          console.error("Google OAuth JWT callback error:", err?.message || err);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user.id = token.id;
        (session as any).user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch {
        // Invalid URL, fall back to baseUrl
      }
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      if (user.id && /^[a-f0-9]{24}$/.test(user.id)) {
        await dbConnect();
        await User.findByIdAndUpdate(user.id, { lastLoginAt: new Date() });
      }
    },
  },
};
