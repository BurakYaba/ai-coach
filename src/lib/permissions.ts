import { User } from "next-auth";

// Extend the User type with compatibility for next-auth User
interface UserWithRole extends User {
  role: string;
}

/**
 * Check if a user has admin privileges
 * @param user The user object from the session
 * @returns True if the user is an admin, false otherwise
 */
export function isAdmin(user?: UserWithRole | null): boolean {
  return user?.role === "admin";
}

/**
 * Check if the current user can access another user's data
 * @param currentUserId The ID of the current user
 * @param targetUserId The ID of the user whose data is being accessed
 * @param currentUserRole The role of the current user
 * @returns True if access is allowed, false otherwise
 */
export function canAccessUserData(
  currentUserId?: string | null,
  targetUserId?: string | null,
  currentUserRole?: string | null
): boolean {
  // No access if current user ID is missing
  if (!currentUserId) return false;

  // Admin can access all user data
  if (currentUserRole === "admin") return true;

  // Users can access their own data
  return currentUserId === targetUserId;
}
