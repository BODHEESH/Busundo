import type { Metadata } from "next";
import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/shared/InstallPrompt";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700", "800"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BusUndo - Travel Together. Travel Smart.",
  description: "The community-powered bus travel platform for Kerala. Find travel companions, track buses in real-time, coordinate with friends, and never travel alone again.",
  keywords: ["bus tracking", "Kerala bus", "travel companions", "ride pooling", "commute", "public transport", "KSRTC"],
  authors: [{ name: "BusUndo" }],
  creator: "BusUndo",
  publisher: "BusUndo",
  applicationName: "BusUndo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BusUndo",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "BusUndo",
    title: "BusUndo - Travel Together. Travel Smart.",
    description: "The community-powered bus travel platform for Kerala",
    images: ["/logo/Busundo banner.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BusUndo - Travel Together. Travel Smart.",
    description: "The community-powered bus travel platform for Kerala",
    images: ["/logo/Busundo banner.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#2563eb",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo/Busundo-Icon.png",
    apple: "/logo/Busundo-Icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo/Busundo-Icon.png" />
        <link rel="apple-touch-icon" href="/logo/Busundo-Icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BusUndo" />
      </head>
      <body
        className={`${sora.variable} ${inter.variable} ${plexMono.variable} font-body bg-paper text-ink antialiased`}
      >
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
