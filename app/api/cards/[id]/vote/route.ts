import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards, votes } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cardId = parseInt(id);
    const body = await request.json();
    const { voteType } = body;

    if (!voteType || !["like", "dislike"].includes(voteType)) {
      return NextResponse.json(
        { error: "Vote type must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(request);

    // Check if user already voted
    const existingVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.cardId, cardId), eq(votes.ipAddress, ipAddress)))
      .limit(1);

    if (existingVote.length > 0) {
      const oldVoteType = existingVote[0].voteType;

      // If same vote type, remove the vote (toggle off)
      if (oldVoteType === voteType) {
        await db
          .delete(votes)
          .where(eq(votes.id, existingVote[0].id));

        // Decrement the count
        await db
          .update(cards)
          .set({
            [voteType === "like" ? "likes" : "dislikes"]: sql`${
              voteType === "like" ? cards.likes : cards.dislikes
            } - 1`,
          })
          .where(eq(cards.id, cardId));
      } else {
        // Change vote type
        await db
          .update(votes)
          .set({ voteType })
          .where(eq(votes.id, existingVote[0].id));

        // Update counts: decrement old, increment new
        await db
          .update(cards)
          .set({
            likes: sql`${cards.likes} ${voteType === "like" ? "+ 1" : "- 1"}`,
            dislikes: sql`${cards.dislikes} ${
              voteType === "dislike" ? "+ 1" : "- 1"
            }`,
          })
          .where(eq(cards.id, cardId));
      }
    } else {
      // New vote
      await db.insert(votes).values({
        cardId,
        ipAddress,
        voteType,
      });

      // Increment the count
      await db
        .update(cards)
        .set({
          [voteType === "like" ? "likes" : "dislikes"]: sql`${
            voteType === "like" ? cards.likes : cards.dislikes
          } + 1`,
        })
        .where(eq(cards.id, cardId));
    }

    // Return updated card
    const updatedCard = await db
      .select()
      .from(cards)
      .where(eq(cards.id, cardId))
      .limit(1);

    return NextResponse.json(updatedCard[0]);
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cardId = parseInt(id);
    const ipAddress = getClientIp(request);

    const userVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.cardId, cardId), eq(votes.ipAddress, ipAddress)))
      .limit(1);

    return NextResponse.json({
      voted: userVote.length > 0,
      voteType: userVote.length > 0 ? userVote[0].voteType : null,
    });
  } catch (error) {
    console.error("Error getting vote status:", error);
    return NextResponse.json(
      { error: "Failed to get vote status" },
      { status: 500 }
    );
  }
}
