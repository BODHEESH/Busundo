/**
 * DEVELOPMENT-ONLY mock login.
 *
 * Hard-coded test accounts so the app can be built and tested before real
 * sign-in (email one-time codes) is finished.
 *
 * Safety:
 * - Disabled automatically when NODE_ENV === "production" (this includes
 *   Vercel production AND preview deployments).
 * - Can be turned off explicitly with ENABLE_MOCK_LOGIN=false.
 * - Remove this file and its use in lib/auth-options.ts before public launch.
 */

export const MOCK_USERS = [
  {
    id: "000000000000000000000001",
    name: "Test Commuter",
    email: "user@busundo.test",
    password: "user123",
    role: "user",
  },
  {
    id: "000000000000000000000002",
    name: "Test Admin",
    email: "admin@busundo.test",
    password: "admin123",
    role: "admin",
  },
] as const;

export function isMockLoginEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_MOCK_LOGIN !== "false"
  );
}
