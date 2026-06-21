import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// Helper to get current session on server
export async function getSession() {
  const session = await getServerSession();
  return session;
}

// Check if user is authenticated
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

// Check if user has required role
export async function hasRole(requiredRoles: string[]) {
  const session = await getSession();
  if (!session?.user) return false;
  const userRole = (session.user as any).role || 'user';
  return requiredRoles.includes(userRole);
}

// Check if user is admin
export async function isAdmin() {
  return hasRole(['admin', 'superadmin']);
}

// Check if user is moderator or above
export async function isModerator() {
  return hasRole(['moderator', 'admin', 'superadmin']);
}

// Middleware helper for API routes
export async function requireAuth(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  return null;
}

export async function requireAdmin(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  const userRole = (session.user as any).role || 'user';
  if (!['admin', 'superadmin'].includes(userRole)) {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    );
  }
  return null;
}

// Client-side auth hook helper
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
};

export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const;

export const ROLE_HIERARCHY = ['user', 'moderator', 'admin', 'superadmin'];

export function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}
