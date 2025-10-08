import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { disputes } from "@/lib/db/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cardId = parseInt(id);
    const body = await request.json();
    const { name, email, reason } = body;

    if (!name || !email || !reason) {
      return NextResponse.json(
        { error: "Name, email, and reason are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const newDispute = await db
      .insert(disputes)
      .values({
        cardId,
        name,
        email,
        reason,
      })
      .returning();

    return NextResponse.json(
      { message: "Dispute submitted successfully", dispute: newDispute[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting dispute:", error);
    return NextResponse.json(
      { error: "Failed to submit dispute" },
      { status: 500 }
    );
  }
}
