import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allCards = await db
      .select()
      .from(cards)
      .orderBy(desc(cards.createdAt));

    return NextResponse.json(allCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, industry, country, side, description, links, imageUrl } = body;

    if (!name || !type || !country || !side || !description) {
      return NextResponse.json(
        { error: "Name, type, country, side, and description are required" },
        { status: 400 }
      );
    }

    if (!["person", "organization"].includes(type.toLowerCase())) {
      return NextResponse.json(
        { error: "Type must be 'person' or 'organization'" },
        { status: 400 }
      );
    }

    if (!industry) {
      return NextResponse.json(
        { error: type.toLowerCase() === "organization" ? "Industry is required for organizations" : "Field is required for persons" },
        { status: 400 }
      );
    }

    if (!["good", "bad"].includes(side.toLowerCase())) {
      return NextResponse.json(
        { error: "Side must be 'good' or 'bad'" },
        { status: 400 }
      );
    }

    // Validate and filter links
    const validLinks = links
      ? links.filter((link: string) => link.trim() !== "").slice(0, 10)
      : [];

    if (validLinks.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 evidence links allowed" },
        { status: 400 }
      );
    }

    const newCard = await db
      .insert(cards)
      .values({
        name,
        type: type.toLowerCase(),
        industry: industry, // Both person fields and organization industries
        country,
        side: side.toLowerCase(),
        description,
        links: validLinks,
        imageUrl: imageUrl || null,
      })
      .returning();

    return NextResponse.json(newCard[0], { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating card:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return NextResponse.json(
        { error: "A card with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
