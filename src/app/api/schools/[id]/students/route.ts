import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { authOptions, canManageSchool } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// GET /api/schools/[id]/students - Get students for a school
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user can manage this school
    const canManage = await canManageSchool(session.user.id, id);
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Verify school exists
    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Build query
    const query: any = { school: id, role: "user" };

    // Get the current user to check if they're a branch admin
    const admin = await User.findById(session.user.id);

    // If admin is associated with a branch, automatically filter by that branch
    if (admin?.role === "school_admin" && admin.branch) {
      // Branch admins should only see students from their branch
      query.branch = admin.branch;
    } else {
      // For school-wide admins or system admins, respect the branch filter if provided
      const branchId = searchParams.get("branchId");
      if (branchId && branchId !== "all") {
        query.branch = branchId;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalStudents = await User.countDocuments(query);

    // Get students with pagination
    const students = await User.find(query, { password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      students,
      pagination: {
        total: totalStudents,
        page,
        limit,
        pages: Math.ceil(totalStudents / limit),
      },
      isBranchAdmin: !!admin?.branch, // Tell the frontend if this is a branch admin
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// POST /api/schools/[id]/students - Add/invite students to a school
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user can manage this school
    const canManage = await canManageSchool(session.user.id, id);
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    // Verify school exists
    const school = await School.findById(id);
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Check if school has an active subscription
    if (!school.hasActiveSubscription()) {
      return NextResponse.json(
        { error: "School does not have an active subscription" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Get the branch ID from the request or from the admin's profile
    let branchId = body.branchId;

    // If no branch ID is provided, check if the admin is associated with a branch
    if (!branchId) {
      const admin = await User.findById(session.user.id);
      if (admin && admin.branch) {
        branchId = admin.branch.toString();
      }
    }

    // Handle bulk student creation
    if (Array.isArray(body.students)) {
      // Count current users in the school
      const currentUserCount = await User.countDocuments({ school: id });

      // Check if adding these students would exceed the limit
      if (
        school.subscription.maxUsers > 0 &&
        currentUserCount + body.students.length > school.subscription.maxUsers
      ) {
        return NextResponse.json(
          {
            error: "Adding these students would exceed the school user limit",
            currentCount: currentUserCount,
            maxUsers: school.subscription.maxUsers,
            attempting: body.students.length,
          },
          { status: 400 }
        );
      }

      const results = {
        created: [] as any[],
        existing: [] as any[],
        failed: [] as any[],
      };

      // Process each student
      for (const student of body.students) {
        try {
          if (!student.email || !student.name) {
            results.failed.push({
              email: student.email || "missing",
              reason: "Missing required fields",
            });
            continue;
          }

          // Check if user already exists
          let user = await User.findOne({ email: student.email });

          if (user) {
            // If user exists but isn't part of this school, update them
            if (!user.school || user.school.toString() !== id) {
              user.school = new mongoose.Types.ObjectId(id);

              // Also update branch if available
              if (branchId) {
                user.branch = new mongoose.Types.ObjectId(branchId);
              }

              await user.save();
              results.existing.push({
                id: user._id,
                email: user.email,
                name: user.name,
                status: "updated",
              });
            } else {
              // User already in this school
              results.existing.push({
                id: user._id,
                email: user.email,
                name: user.name,
                status: "already_enrolled",
              });
            }
          } else {
            // Create new user
            // Generate random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const userData: any = {
              name: student.name,
              email: student.email,
              password: hashedPassword,
              role: "user",
              school: id,
              subscription: {
                type: "none",
                status: "active", // Active through school subscription
              },
            };

            // Add branch if available
            if (branchId) {
              userData.branch = branchId;
            }

            user = await User.create(userData);

            results.created.push({
              id: user._id,
              email: user.email,
              name: user.name,
              tempPassword: randomPassword, // Include temp password for admin to share
            });

            // TODO: Implement email sending to invite students
            // This would be where you'd send an email with the temp password
          }
        } catch (err) {
          console.error("Error processing student:", student.email, err);
          results.failed.push({
            email: student.email || "unknown",
            reason: (err as Error).message || "Unknown error",
          });
        }
      }

      return NextResponse.json(results);
    } else {
      // Single student creation
      if (!body.email || !body.name) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Check if user already exists
      let user = await User.findOne({ email: body.email });

      if (user) {
        // If user exists but isn't part of this school, update them
        if (!user.school || user.school.toString() !== id) {
          user.school = new mongoose.Types.ObjectId(id);

          // Also update branch if available
          if (branchId) {
            user.branch = new mongoose.Types.ObjectId(branchId);
          }

          await user.save();

          return NextResponse.json({
            message: "User added to school",
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
            },
          });
        } else {
          // User already in this school
          return NextResponse.json(
            { error: "User already belongs to this school" },
            { status: 400 }
          );
        }
      } else {
        // Create new user
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const userData: any = {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          role: "user",
          school: id,
          subscription: {
            type: "none",
            status: "active", // Active through school subscription
          },
        };

        // Add branch if available
        if (branchId) {
          userData.branch = branchId;
        }

        user = await User.create(userData);

        return NextResponse.json(
          {
            message: "User created successfully",
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              tempPassword: randomPassword,
            },
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.error("Error adding students:", error);
    return NextResponse.json(
      { error: "Failed to add students" },
      { status: 500 }
    );
  }
}
