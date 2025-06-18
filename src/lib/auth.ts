import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/models/User";
import School from "@/models/School";
import Branch from "@/models/Branch";
import {
  createUserSession,
  validateSession,
  checkConcurrentLogin,
  parseDeviceInfo,
  forceLogoutUser,
} from "@/lib/session-manager";

import dbConnect from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
        forceLogin: { label: "Force Login", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await user.comparePassword(
          credentials.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email address before logging in. Check your inbox for the verification link."
          );
        }

        // Check subscription status
        if (!user.hasActiveSubscription()) {
          throw new Error(
            "Your subscription has expired. Please contact your administrator or renew your subscription to continue."
          );
        }

        // Check for concurrent login (skip if force login is requested)
        const forceLogin = credentials.forceLogin === "true";

        if (!forceLogin) {
          const concurrentCheck = await checkConcurrentLogin(
            user._id.toString()
          );

          if (concurrentCheck.hasActiveSession) {
            const activeSession = concurrentCheck.activeSession;
            const deviceInfo = activeSession.deviceInfo;

            // Create a user-friendly device description
            let deviceDescription = "another device";

            if (deviceInfo.browser && deviceInfo.browser !== "Unknown") {
              if (deviceInfo.os && deviceInfo.os !== "Unknown") {
                deviceDescription = `another device (${deviceInfo.browser} on ${deviceInfo.os})`;
              } else {
                deviceDescription = `another device (${deviceInfo.browser})`;
              }
            } else if (
              deviceInfo.deviceType &&
              deviceInfo.deviceType !== "unknown"
            ) {
              deviceDescription = `another ${deviceInfo.deviceType}`;
            }

            throw new Error(
              `Your account is already logged in from ${deviceDescription}. Please log out from the other device first, or use "Force Login" to continue. If this wasn't you, please contact support immediately.`
            );
          }
        } else {
          // Force login requested - terminate all existing sessions
          await forceLogoutUser(user._id.toString());
        }

        // Get school and branch info for session
        let school = null;
        let branch = null;

        if (user.school) {
          school = await School.findById(user.school);
        }

        if (user.branch) {
          branch = await Branch.findById(user.branch);
        }

        // Calculate session expiration
        const rememberMe = credentials.rememberMe === "true";
        const sessionDuration = rememberMe ? 30 : 7; // days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + sessionDuration);

        // Parse device info from request (req should contain the raw request)
        const deviceInfo = {
          userAgent: "Unknown",
          ip: "127.0.0.1",
          deviceType: "unknown" as const,
          browser: "Unknown",
          os: "Unknown",
        };

        // Note: In NextAuth, getting request info in authorize is limited
        // We'll create the session in the JWT callback where we have better access

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          rememberMe,
          subscription: {
            status: user.subscription.status,
            type: user.subscription.type,
            expiresAt: user.subscription.endDate?.toISOString() || "",
          },
          school: school?._id?.toString() || null,
          branch: branch?._id?.toString() || null,
          onboardingCompleted: user.onboarding?.completed || false,
          sessionExpiry: expiresAt.toISOString(),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Default 7 days (will be overridden in jwt callback based on rememberMe)
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rememberMe = user.rememberMe;
        token.sessionExpiry = user.sessionExpiry;

        // Create session token for concurrent login tracking
        const sessionDuration = user.rememberMe ? 30 : 7; // days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + sessionDuration);

        // Enhanced device info - will be improved with client-side detection
        const deviceInfo = {
          userAgent: "NextAuth Session",
          ip: "127.0.0.1",
          deviceType: "unknown" as const,
          browser: "Unknown",
          os: "Unknown",
          // Add timestamp to make sessions unique even with same browser
          sessionId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        try {
          const sessionToken = await createUserSession(
            user.id,
            deviceInfo,
            expiresAt
          );
          token.sessionToken = sessionToken;

          // Store additional session metadata
          token.sessionCreated = Date.now();
          token.deviceFingerprint = `${deviceInfo.browser}-${deviceInfo.os}-${deviceInfo.sessionId}`;
        } catch (error) {
          console.error("Failed to create user session:", error);
          // Don't fail login if session creation fails, but log it
        }

        // Set token expiration based on remember me preference
        if (user.rememberMe) {
          // Extend session to 30 days if "Remember Me" is checked
          token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        } else {
          // Default 7 days if "Remember Me" is not checked
          token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        }

        // Set subscription info in token
        token.subscriptionStatus = user.subscription?.status;
        token.subscriptionType = user.subscription?.type;
        token.subscriptionExpiry = user.subscription?.expiresAt;
        token.school = user.school;
        token.branch = user.branch;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      // Set force refresh flag when triggered by session update
      if (trigger === "update" && session?.forceRefresh) {
        token.forceRefresh = true;
      }

      // Validate session token if it exists
      if (token.sessionToken && typeof token.sessionToken === "string") {
        try {
          const sessionValidation = await validateSession(token.sessionToken);
          if (!sessionValidation.isValid) {
            // Session is invalid, force re-authentication
            token.sessionValid = false;
          }
        } catch (error) {
          console.error("Session validation error:", error);
          // Don't fail on session validation errors, but log them
        }
      }

      // Check subscription expiry more frequently
      const lastSubscriptionCheck = token.subscriptionLastChecked as string;
      const now = new Date();

      if (
        !lastSubscriptionCheck ||
        now.getTime() - new Date(lastSubscriptionCheck).getTime() >
          60 * 60 * 1000 // 1 hour
      ) {
        try {
          await dbConnect();
          const user = await User.findById(token.id);
          if (user) {
            token.subscriptionStatus = user.subscription.status;
            token.subscriptionType = user.subscription.type;
            token.subscriptionExpiry = user.subscription.endDate?.toISOString();
            token.subscriptionLastChecked = now.toISOString();
            token.onboardingCompleted = user.onboarding?.completed || false;
          }
        } catch (error) {
          console.error("Error refreshing subscription status:", error);
        }
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.rememberMe = token.rememberMe as boolean;
        session.user.sessionToken = token.sessionToken as string;

        // Add subscription info to the session
        session.user.subscription = {
          status: token.subscriptionStatus as string,
          type: token.subscriptionType as string,
          expiresAt: token.subscriptionExpiry as string,
        };

        // Add onboarding status to the session
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      rememberMe?: boolean;
      sessionToken?: string;
      subscription?: {
        status: string;
        type: string;
        expiresAt: string;
      };
      onboardingCompleted?: boolean;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    rememberMe?: boolean;
    subscription?: {
      status: string;
      type: string;
      expiresAt: string;
    };
    school?: string | null;
    branch?: string | null;
    onboardingCompleted?: boolean;
    sessionExpiry?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    rememberMe?: boolean;
    sessionToken?: string;
    subscriptionStatus?: string;
    subscriptionType?: string;
    subscriptionExpiry?: string;
    subscriptionLastChecked?: string;
    school?: string | null;
    branch?: string | null;
    forceRefresh?: boolean;
    onboardingCompleted?: boolean;
    sessionValid?: boolean;
    sessionCreated?: number;
    deviceFingerprint?: string;
  }
}

// Check if user is a system admin
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    // Dynamically import User model to avoid server/client mismatch issues
    const User = (await import("@/models/User")).default;
    await dbConnect();

    const user = await User.findById(userId);
    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Check if user is a school admin
export async function isSchoolAdmin(userId: string): Promise<boolean> {
  try {
    const User = (await import("@/models/User")).default;
    await dbConnect();

    const user = await User.findById(userId);
    return user?.role === "school_admin" || user?.role === "admin";
  } catch (error) {
    console.error("Error checking school admin status:", error);
    return false;
  }
}

// Check if user has access to manage specific school
export async function canManageSchool(
  userId: string,
  schoolId: string
): Promise<boolean> {
  try {
    const User = (await import("@/models/User")).default;
    const School = (await import("@/models/School")).default;
    const Branch = (await import("@/models/Branch")).default;
    await dbConnect();

    const user = await User.findById(userId);

    // System admins can manage any school
    if (user?.role === "admin") return true;

    // Check if this user is an admin for this specific school
    if (user?.role === "school_admin") {
      const school = await School.findById(schoolId);

      // Check if user is directly listed as a school admin
      const isSchoolAdmin =
        school?.admins.some(admin => admin.toString() === userId) || false;

      // If user has a branch association, check if they're a branch admin
      if (!isSchoolAdmin && user.branch) {
        const branch = await Branch.findById(user.branch);
        if (branch && branch.school.toString() === schoolId) {
          return (
            branch.admins.some(admin => admin.toString() === userId) || false
          );
        }
      }

      return isSchoolAdmin;
    }

    return false;
  } catch (error) {
    console.error("Error checking school management permission:", error);
    return false;
  }
}

// Check if user has access to manage specific student
export async function canManageStudent(
  managerId: string,
  studentId: string
): Promise<boolean> {
  try {
    const User = (await import("@/models/User")).default;
    await dbConnect();

    // Get both users
    const manager = await User.findById(managerId);
    const student = await User.findById(studentId);

    if (!manager || !student) return false;

    // Admin can manage any student
    if (manager.role === "admin") return true;

    // School admin can manage students in their school
    if (manager.role === "school_admin" && student.school) {
      // First verify they're in the same school
      const sameSchool =
        student.school.toString() === manager.school?.toString();
      if (!sameSchool) return false;

      // If manager is associated with a branch, they should ONLY manage students in their branch
      if (manager.branch) {
        return student.branch?.toString() === manager.branch.toString();
      }

      // School-level admins (without branch association) can manage all students in the school
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking student management permission:", error);
    return false;
  }
}

// Check if user has an active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const User = (await import("@/models/User")).default;
    const School = (await import("@/models/School")).default;
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) return false;

    // Check if user's subscription has expired and update status if needed
    if (
      user.subscription?.status === "active" &&
      user.subscription.endDate &&
      new Date(user.subscription.endDate) < new Date()
    ) {
      // Subscription has expired, update the status
      await User.findByIdAndUpdate(user._id, {
        "subscription.status": "expired",
      });
      return false;
    }

    // Now check if user's subscription is active and valid
    if (
      user.subscription?.status === "active" &&
      (!user.subscription.endDate ||
        new Date(user.subscription.endDate) > new Date())
    ) {
      return true;
    }

    // If user belongs to a school, check school's subscription similarly
    if (user.school) {
      const school = await School.findById(user.school);

      // Check if school subscription has expired and update if needed
      if (
        school &&
        school.subscription?.status === "active" &&
        school.subscription.endDate &&
        new Date(school.subscription.endDate) < new Date()
      ) {
        // School subscription has expired, update the status
        await School.findByIdAndUpdate(school._id, {
          "subscription.status": "expired",
        });
        return false;
      }

      // Now check if school subscription is still valid
      if (
        school &&
        school.subscription?.status === "active" &&
        (!school.subscription.endDate ||
          new Date(school.subscription.endDate) > new Date())
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}
