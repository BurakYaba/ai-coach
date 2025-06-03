import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ListeningSession from "@/models/ListeningSession";
import User from "@/models/User";
import School from "@/models/School";
import { checkAndUpdateUserSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchTerm = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Add search filter if provided
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Fetch paginated users - include subscription information
    const users = await User.find(query)
      .select("_id name email image role createdAt subscription")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // For each user, get their session stats and check subscription status
    const usersWithStats = await Promise.all(
      users.map(async user => {
        const userId = user._id.toString();

        // Check and update subscription status if expired
        await checkAndUpdateUserSubscription(userId);

        // Refetch user to get updated subscription status
        const updatedUser = await User.findById(userId).select("subscription");

        // Total listening sessions
        const totalSessions = await ListeningSession.countDocuments({
          userId: userId,
        });

        // Completed sessions
        const completedSessions = await ListeningSession.countDocuments({
          userId: userId,
          isCompleted: true,
        });

        // Last active date - last session created
        const lastSession = await ListeningSession.findOne({
          userId: userId,
        }).sort({ createdAt: -1 });

        // Determine actual subscription status based on endDate
        let actualStatus = updatedUser?.subscription?.status || "pending";

        // Double-check: if status is active but endDate has passed, mark as expired
        if (
          actualStatus === "active" &&
          updatedUser?.subscription?.endDate &&
          new Date(updatedUser.subscription.endDate) < new Date()
        ) {
          actualStatus = "expired";
        }

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          subscription: {
            type: updatedUser?.subscription?.type || "free",
            status: actualStatus,
            startDate: updatedUser?.subscription?.startDate,
            endDate: updatedUser?.subscription?.endDate,
          },
          stats: {
            totalSessions,
            completedSessions,
            completionRate:
              totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
            lastActive: lastSession?.createdAt || user.createdAt,
          },
        };
      })
    );

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      name,
      email,
      password,
      role,
      school: schoolId,
      branch: branchId,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if role is valid
    if (!["user", "school_admin", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Validate school/branch if role is school_admin
    if (role === "school_admin" && schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return NextResponse.json(
          { error: "Selected school not found" },
          { status: 400 }
        );
      }

      // If branch provided, verify it exists
      if (branchId) {
        // You would validate the branch belongs to the school here
        // This depends on your data model structure
      }
    }

    // Create user object with appropriate subscription status based on role
    const userData: any = {
      name,
      email,
      password, // Use the plain password - the pre-save hook in the User model will hash it
      role,
      subscription: {
        type: "free",
        status: "active", // Default to active for all users created by admin
      },
    };

    // Add school reference if school_admin
    if (role === "school_admin" && schoolId) {
      userData.school = new mongoose.Types.ObjectId(schoolId);

      // Add branch if provided
      if (branchId) {
        userData.branch = new mongoose.Types.ObjectId(branchId);
      }
    }

    // Create the user
    const user = await User.create(userData);

    // If school_admin, add user to school admins array
    if (role === "school_admin" && schoolId) {
      await School.findByIdAndUpdate(schoolId, {
        $addToSet: { admins: user._id },
      });
    }

    // Return user without password
    const userResponse = user.toObject();
    const userWithoutPassword = { ...userResponse };
    // @ts-expect-error - Password may not be recognized as a property by TypeScript
    delete userWithoutPassword.password;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
