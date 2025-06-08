import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "@/models/User";
import School from "@/models/School";
import Branch from "@/models/Branch";

import dbConnect from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
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

        // Check subscription status for regular users (not admins)
        if (user.role === "user") {
          // Check if user has an active subscription
          const isSubscriptionActive = await hasActiveSubscription(user._id);

          if (!isSubscriptionActive) {
            const subscriptionType = user.subscription?.type || "free";

            // Different handling for individual vs school users
            if (!user.school) {
              // Individual user - allow login, middleware will handle redirect to pricing
              // Don't throw error, let them log in and middleware will redirect appropriately
            } else {
              // School user - block login and show error message
              throw new Error(
                `Your ${subscriptionType} subscription has expired. Please contact your branch administrator.`
              );
            }
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          rememberMe: credentials.rememberMe === "true",
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

        // Set token expiration based on remember me preference
        if (user.rememberMe) {
          // Extend session to 30 days if "Remember Me" is checked
          token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        } else {
          // Default 7 days if "Remember Me" is not checked
          token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        }
      }

      // Set force refresh flag when triggered by session update
      if (trigger === "update" && session?.forceRefresh) {
        token.forceRefresh = true;
      }

      // Add subscription and school information to token if not already present or needs refreshing
      // This helps with middleware subscription checks
      try {
        // We periodically refresh the subscription info to ensure it's current
        const shouldRefreshSubscription =
          !token.subscriptionLastChecked ||
          new Date(token.subscriptionLastChecked as string).getTime() +
            60 * 60 * 1000 <
            Date.now(); // Refresh every hour

        // Force refresh if this is right after a payment (indicated by refresh_token in URL)
        const shouldForceRefresh = token.forceRefresh === true;

        if ((shouldRefreshSubscription || shouldForceRefresh) && token.id) {
          await dbConnect();
          const User = (await import("@/models/User")).default;
          const userRecord = await User.findById(token.id);

          if (userRecord) {
            token.subscriptionStatus = userRecord.subscription?.status;
            token.subscriptionType = userRecord.subscription?.type;
            token.subscriptionExpiry = userRecord.subscription?.endDate
              ? userRecord.subscription.endDate.toISOString()
              : undefined;
            token.subscriptionLastChecked = new Date().toISOString();
            // Add school information to distinguish individual vs school users
            token.school = userRecord.school
              ? userRecord.school.toString()
              : null;

            // Add onboarding completion status
            token.onboardingCompleted =
              userRecord.onboarding?.completed || false;

            // Clear the force refresh flag after refreshing
            if (shouldForceRefresh) {
              token.forceRefresh = false;
            }
          }
        }
      } catch (error) {
        console.error("Error refreshing subscription in token:", error);
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.rememberMe = token.rememberMe as boolean;

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
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Maximum 30 days (for remember me users)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    user: {
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
      onboardingCompleted?: boolean;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    rememberMe?: boolean;
    subscriptionStatus?: string;
    subscriptionType?: string;
    subscriptionExpiry?: string;
    subscriptionLastChecked?: string;
    school?: string | null;
    forceRefresh?: boolean;
    onboardingCompleted?: boolean;
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
