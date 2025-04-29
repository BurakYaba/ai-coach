import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Branch from "@/models/Branch";
import School from "@/models/School";

export const dynamic = "force-dynamic";

// Get all branches or create a new branch
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
    const schoolId = searchParams.get("schoolId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const searchTerm = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Filter by school if provided
    if (schoolId) {
      query.school = schoolId;
    }

    // Add search filter if provided
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" };
    }

    // Get total count for pagination
    const total = await Branch.countDocuments(query);

    // Fetch paginated branches with school info
    const branches = await Branch.find(query)
      .populate("school", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      branches,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}

// Create a new branch
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
    const { name, schoolId, location, contactInfo } = body;

    if (!name || !schoolId) {
      return NextResponse.json(
        { error: "Name and schoolId are required" },
        { status: 400 }
      );
    }

    // Check if school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Create new branch
    const branch = new Branch({
      name,
      school: schoolId,
      location: location || {},
      contactInfo: contactInfo || {},
      admins: [], // Initially no admins
    });

    await branch.save();

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Error creating branch:", error);
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  }
}
