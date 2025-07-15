import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/User";
import School from "@/models/School";
import Branch from "@/models/Branch";
import {
  createUserSession,
  validateSession,
  checkConcurrentLogin,
  forceLogoutUser,
  terminateSession,
} from "@/lib/session-manager";

import dbConnect from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        forceLogin: { label: "Force Login", type: "checkbox" },
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

        // Check subscription status (only for regular users, not admins)
        // Instead of blocking login, we'll let expired users login but redirect them to pricing
        const hasActiveSubscription = user.hasActiveSubscription();
        const isExpiredUser = user.role === "user" && !hasActiveSubscription;

        // Check for concurrent login (skip if force login is requested)
        const forceLogin = credentials.forceLogin === "true";

        // Single session per user - but with smart cleanup to prevent UX issues
        if (!forceLogin) {
          const concurrentCheck = await checkConcurrentLogin(
            user._id.toString()
          );

          if (concurrentCheck.hasActiveSession) {
            const activeSession = concurrentCheck.activeSession;

            // Check if the session is stale (no activity for 2+ hours)
            // This handles cases where browser was closed without proper cleanup
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const isStaleSession = activeSession.lastActivity < twoHoursAgo;

            if (isStaleSession) {
              // Automatically clean up stale session and allow login
              console.log(`Cleaning up stale session for user ${user._id}`);
              await terminateSession(activeSession.sessionToken, "expired");
            } else {
              // Session is recent, show concurrent login error with better message
              const deviceInfo = activeSession.deviceInfo;

              // Create a user-friendly device description
              let deviceDescription = "another device";

              if (deviceInfo.browser && deviceInfo.browser !== "Unknown") {
                if (deviceInfo.os && deviceInfo.os !== "Unknown") {
                  deviceDescription = `${deviceInfo.browser} on ${deviceInfo.os}`;
                } else {
                  deviceDescription = `${deviceInfo.browser}`;
                }
              } else if (
                deviceInfo.deviceType &&
                deviceInfo.deviceType !== "unknown"
              ) {
                deviceDescription = `another ${deviceInfo.deviceType}`;
              }

              throw new Error(
                `Your account is already logged in from ${deviceDescription}. If this is you, use "Force Login" to continue. If not, please contact support immediately.`
              );
            }
          }
        }

        if (forceLogin) {
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

        // Calculate session expiration - fixed 1 day duration
        const sessionDuration = 1; // 1 day default
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + sessionDuration);

        // Parse device info from request (req should contain the raw request)
        const deviceInfo = {
          userAgent: req?.headers?.["user-agent"] || "Unknown",
          ip: "127.0.0.1", // Default IP since NextAuth req doesn't expose IP directly
          deviceType: "unknown" as const,
          browser: "Unknown",
          os: "Unknown",
        };

        // Create user session in database for concurrent login protection
        const sessionToken = await createUserSession(
          user._id.toString(),
          deviceInfo,
          expiresAt,
          {
            terminateOthers: true, // RESTORED: Concurrent login protection
            reason: forceLogin ? "force_login" : "credentials_login",
          }
        );

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          sessionToken, // Now properly set
          subscription: {
            status: user.subscription.status,
            type: user.subscription.type,
            expiresAt: user.subscription.endDate?.toISOString() || "",
          },
          school: school?._id?.toString() || null,
          branch: branch?._id?.toString() || null,
          onboardingCompleted: user.onboarding?.completed ?? false,
          nativeLanguage: user.onboarding?.nativeLanguage || "turkish",
          sessionExpiry: expiresAt.toISOString(),
          isExpiredUser, // Add expired status for redirect logic
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours (1 day)
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();

          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            // Update existing user with OAuth provider info if not already set
            if (
              !existingUser.provider ||
              existingUser.provider === "credentials"
            ) {
              existingUser.provider = account.provider;
              existingUser.providerId = account.providerAccountId;
              await existingUser.save();
            }
            return true;
          }

          // Create new OAuth user
          const userData = {
            name: user.name || profile?.name || "OAuth User",
            email: user.email,
            emailVerified: true, // OAuth emails are pre-verified
            provider: account.provider,
            providerId: account.providerAccountId,
            role: "user", // Default role for OAuth users
            subscription: {
              type: "free",
              status: "active",
              startDate: new Date(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days free trial
            },
            onboarding: {
              completed: false, // OAuth users go through the same 5-step onboarding
              currentStep: 1,
              language: "en" as "en" | "tr",
              nativeLanguage: "",
              country: "", // Default value for compatibility
              region: "", // Default value for compatibility
              preferredPracticeTime: "",
              preferredLearningDays: [],
              reminderTiming: "1_hour", // Default reminder timing
              reasonsForLearning: [],
              howHeardAbout: account.provider, // Track OAuth source
              dailyStudyTimeGoal: 30, // Default value for compatibility
              weeklyStudyTimeGoal: 210, // Default value for compatibility
              consentDataUsage: false,
              consentAnalytics: false,
              skillAssessment: {
                completed: false,
                ceferLevel: "B1",
                weakAreas: ["grammar", "vocabulary"],
                strengths: ["reading"],
                assessmentDate: new Date(),
                scores: {
                  reading: 50,
                  writing: 40,
                  listening: 45,
                  speaking: 35,
                  vocabulary: 40,
                  grammar: 35,
                },
              },
              preferences: {
                learningGoals: ["general_fluency"],
                interests: [],
                timeAvailable: "30-60 minutes",
                preferredTime: "evening",
                learningStyle: "mixed",
                difficultyPreference: "moderate",
                focusAreas: [],
                strengths: [],
                weaknesses: [],
              },
              recommendedPath: {
                primaryFocus: ["vocabulary", "grammar", "reading"],
                suggestedOrder: [
                  "vocabulary",
                  "reading",
                  "grammar",
                  "writing",
                  "listening",
                  "speaking",
                  "games",
                ],
                estimatedWeeks: 12,
              },
              tours: {
                completed: [],
                skipped: [],
              },
              moduleVisits: {},
            },
          };

          const newUser = new User(userData);
          await newUser.save();

          console.log(
            `Created new OAuth user: ${user.email} via ${account.provider}`,
            {
              userId: newUser._id,
              provider: account.provider,
              providerId: account.providerAccountId,
              subscriptionEndDate: userData.subscription.endDate,
              timestamp: new Date().toISOString(),
            }
          );
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true; // Allow credentials provider
    },
    async jwt({
      token,
      user,
      account,
      trigger,
    }: {
      token: JWT;
      user?: any;
      account?: any;
      trigger?: string;
    }) {
      // Handle OAuth user sign in
      if (user && account && account.provider === "google") {
        await dbConnect();

        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.provider = account.provider;

          // Get school and branch info
          let school = null;
          let branch = null;
          if (dbUser.school) {
            school = await School.findById(dbUser.school);
            token.school = school?._id?.toString() || null;
          }
          if (dbUser.branch) {
            branch = await Branch.findById(dbUser.branch);
            token.branch = branch?._id?.toString() || null;
          }

          token.onboardingCompleted = dbUser.onboarding?.completed ?? false;
          token.nativeLanguage = dbUser.onboarding?.nativeLanguage || "turkish";
          token.sessionValid = true;
          token.sessionCreated = Date.now();

          // Add subscription info with defensive programming for old users
          const subscription = dbUser.subscription || {};
          token.subscriptionStatus = subscription.status || "inactive";
          token.subscriptionType = subscription.type || "individual";
          token.subscriptionExpiry =
            subscription.endDate?.toISOString() || undefined;

          // Check if user is expired (for individual users only)
          const hasActiveSubscription = dbUser.hasActiveSubscription();
          token.isExpiredUser =
            dbUser.role === "user" && !hasActiveSubscription;

          // Create session for OAuth users (for concurrent login protection)
          if (!token.sessionToken) {
            const deviceInfo = {
              userAgent: "OAuth Login",
              ip: "127.0.0.1",
              deviceType: "unknown" as const,
              browser: "Unknown",
              os: "Unknown",
            };

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1); // 1 day

            try {
              const sessionToken = await createUserSession(
                dbUser._id.toString(),
                deviceInfo,
                expiresAt,
                { terminateOthers: true, reason: "oauth_login" } // RESTORED: Concurrent login protection
              );
              token.sessionToken = sessionToken;
            } catch (error) {
              console.error("Error creating OAuth session:", error);
            }
          }
        }
      }

      // Add user info to token on sign in for credentials provider
      if (user && account && account.provider === "credentials") {
        token.id = user.id;
        token.role = user.role;
        token.sessionToken = user.sessionToken;
        token.school = user.school;
        token.branch = user.branch;
        token.onboardingCompleted = user.onboarding?.completed ?? false;
        token.sessionValid = true;
        token.sessionCreated = Date.now();
        token.deviceFingerprint = user.deviceFingerprint;
        token.isExpiredUser = user.isExpiredUser;
        token.nativeLanguage = user.nativeLanguage;

        // Add subscription info
        token.subscriptionStatus = user.subscription?.status || "inactive";
        token.subscriptionType = user.subscription?.type || "individual";
        token.subscriptionExpiry = user.subscription?.expiresAt;
      }

      // Handle forced refresh or update trigger
      if (trigger === "update") {
        try {
          await dbConnect();
          const user = await User.findById(token.id);
          if (user) {
            // Update all user-related fields with defensive programming
            token.onboardingCompleted = user.onboarding?.completed ?? false;
            token.nativeLanguage = user.onboarding?.nativeLanguage || "turkish";
            const subscription = user.subscription || {};
            token.subscriptionStatus = subscription.status || "inactive";
            token.subscriptionType = subscription.type || "individual";
            token.subscriptionExpiry =
              subscription.endDate?.toISOString() || undefined;
            token.subscriptionLastChecked = new Date().toISOString();
          }
        } catch (error) {
          console.error("Error in JWT update trigger:", error);
        }
        return token;
      }

      // Only refresh subscription status every hour to avoid too many DB calls
      const now = new Date();
      const lastSubscriptionCheck = token.subscriptionLastChecked as string;

      const shouldRefreshSubscription =
        !lastSubscriptionCheck ||
        now.getTime() - new Date(lastSubscriptionCheck).getTime() >
          60 * 60 * 1000;

      if (shouldRefreshSubscription) {
        try {
          await dbConnect();
          const user = await User.findById(token.id);
          if (user) {
            const subscription = user.subscription || {};

            token.subscriptionStatus = subscription.status || "inactive";
            token.subscriptionType = subscription.type || "individual";
            token.subscriptionExpiry =
              subscription.endDate?.toISOString() || undefined;
            token.subscriptionLastChecked = now.toISOString();
            token.onboardingCompleted = user.onboarding?.completed ?? false;
            token.nativeLanguage = user.onboarding?.nativeLanguage || "turkish";
          }
        } catch (error) {
          console.error("Error refreshing subscription status:", error);
          // Use fallback values to prevent session invalidation
          token.subscriptionStatus = token.subscriptionStatus || "inactive";
          token.subscriptionType = token.subscriptionType || "individual";
          token.subscriptionExpiry = token.subscriptionExpiry || undefined;
          token.subscriptionLastChecked = now.toISOString();
        }
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
        session.user.sessionToken = token.sessionToken as string;

        // Add subscription info to the session
        session.user.subscription = {
          status: token.subscriptionStatus as string,
          type: token.subscriptionType as string,
          expiresAt: token.subscriptionExpiry as string,
        };

        // Add onboarding status to the session
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
        session.user.nativeLanguage = token.nativeLanguage as string;

        // Add expired user status to the session
        session.user.isExpiredUser = token.isExpiredUser as boolean;
      }

      return session;
    },
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
      provider?: string;
      sessionToken?: string;
      subscription?: {
        status: string;
        type: string;
        expiresAt: string;
      };
      onboardingCompleted?: boolean;
      isExpiredUser?: boolean;
      nativeLanguage?: string;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    subscription?: {
      status: string;
      type: string;
      expiresAt: string;
    };
    school?: string | null;
    branch?: string | null;
    onboardingCompleted?: boolean;
    sessionExpiry?: string;
    isExpiredUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    provider?: string;
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
    isExpiredUser?: boolean;
    nativeLanguage?: string;
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
