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
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email })
          .lean()
          .exec();
        if (!user) {
          throw new Error("No user found with this email");
        }

        const userModel = await User.findById(user._id);
        if (!userModel) {
          throw new Error("User not found");
        }

        const isValid = await userModel.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
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
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
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

    // Check user's own subscription first
    if (
      user.subscription?.status === "active" &&
      (!user.subscription.endDate ||
        new Date(user.subscription.endDate) > new Date())
    ) {
      return true;
    }

    // If user belongs to a school, check school's subscription
    if (user.school) {
      const school = await School.findById(user.school);
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
