import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions, isAdmin } from "@/lib/auth";
import dbConnect from "@/lib/db";
import School from "@/models/School";

export const dynamic = "force-dynamic";

// Get all schools
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
        { "primaryContact.name": { $regex: searchTerm, $options: "i" } },
        { "primaryContact.email": { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await School.countDocuments(query);

    // Fetch paginated schools
    const schools = await School.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      schools,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

// Create a new school
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
    const { name, location, primaryContact } = body;

    if (!name || !primaryContact?.name || !primaryContact?.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new school
    const school = new School({
      name,
      location: location || {},
      primaryContact,
      subscription: {
        type: "free",
        maxUsers: 0,
        status: "active",
      },
      admins: [], // Initially no admins
    });

    await school.save();

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error("Error creating school:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
