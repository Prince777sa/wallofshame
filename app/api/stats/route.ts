import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards, votes, disputes } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Total counts
    const totalCards = await db.select({ count: sql<number>`count(*)` }).from(cards);
    const totalVotes = await db.select({ count: sql<number>`count(*)` }).from(votes);
    const totalDisputes = await db.select({ count: sql<number>`count(*)` }).from(disputes);

    // Cards by type
    const cardsByType = await db
      .select({
        type: cards.type,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .groupBy(cards.type);

    // Cards by side
    const cardsBySide = await db
      .select({
        side: cards.side,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .groupBy(cards.side);

    // Engagement stats
    const totalLikes = await db
      .select({ total: sql<number>`sum(${cards.likes})` })
      .from(cards);
    const totalDislikes = await db
      .select({ total: sql<number>`sum(${cards.dislikes})` })
      .from(cards);

    // Cards created over time (last 30 days)
    const cardsOverTime = await db
      .select({
        date: sql<string>`DATE(${cards.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(sql`${cards.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE(${cards.createdAt})`)
      .orderBy(sql`DATE(${cards.createdAt})`);

    // === ORGANIZATION STATS ===
    const orgCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(cards)
      .where(eq(cards.type, "organization"));

    const orgsBySide = await db
      .select({
        side: cards.side,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(eq(cards.type, "organization"))
      .groupBy(cards.side);

    const topIndustries = await db
      .select({
        industry: cards.industry,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(sql`${cards.type} = 'organization' AND ${cards.industry} IS NOT NULL`)
      .groupBy(cards.industry)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    const topOrgCountries = await db
      .select({
        country: cards.country,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(eq(cards.type, "organization"))
      .groupBy(cards.country)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    const mostLikedOrgs = await db
      .select({
        id: cards.id,
        name: cards.name,
        likes: cards.likes,
        industry: cards.industry,
      })
      .from(cards)
      .where(eq(cards.type, "organization"))
      .orderBy(sql`${cards.likes} DESC`)
      .limit(5);

    const mostDislikedOrgs = await db
      .select({
        id: cards.id,
        name: cards.name,
        dislikes: cards.dislikes,
        industry: cards.industry,
      })
      .from(cards)
      .where(eq(cards.type, "organization"))
      .orderBy(sql`${cards.dislikes} DESC`)
      .limit(5);

    // === PEOPLE STATS ===
    const peopleCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(cards)
      .where(eq(cards.type, "person"));

    const peopleBySide = await db
      .select({
        side: cards.side,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(eq(cards.type, "person"))
      .groupBy(cards.side);

    const topFields = await db
      .select({
        field: cards.industry,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(sql`${cards.type} = 'person' AND ${cards.industry} IS NOT NULL`)
      .groupBy(cards.industry)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    const topPeopleCountries = await db
      .select({
        country: cards.country,
        count: sql<number>`count(*)`,
      })
      .from(cards)
      .where(eq(cards.type, "person"))
      .groupBy(cards.country)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    const mostLikedPeople = await db
      .select({
        id: cards.id,
        name: cards.name,
        likes: cards.likes,
        field: cards.industry,
      })
      .from(cards)
      .where(eq(cards.type, "person"))
      .orderBy(sql`${cards.likes} DESC`)
      .limit(5);

    const mostDislikedPeople = await db
      .select({
        id: cards.id,
        name: cards.name,
        dislikes: cards.dislikes,
        field: cards.industry,
      })
      .from(cards)
      .where(eq(cards.type, "person"))
      .orderBy(sql`${cards.dislikes} DESC`)
      .limit(5);

    return NextResponse.json({
      overview: {
        totalCards: Number(totalCards[0].count),
        totalVotes: Number(totalVotes[0].count),
        totalDisputes: Number(totalDisputes[0].count),
        totalLikes: Number(totalLikes[0].total) || 0,
        totalDislikes: Number(totalDislikes[0].total) || 0,
      },
      cardsByType: cardsByType.map(item => ({
        type: item.type,
        count: Number(item.count),
      })),
      cardsBySide: cardsBySide.map(item => ({
        side: item.side,
        count: Number(item.count),
      })),
      cardsOverTime: cardsOverTime.map(item => ({
        date: item.date,
        count: Number(item.count),
      })),
      organizations: {
        total: Number(orgCount[0]?.count) || 0,
        bySide: orgsBySide.map(item => ({
          side: item.side,
          count: Number(item.count),
        })),
        topIndustries: topIndustries.map(item => ({
          industry: item.industry,
          count: Number(item.count),
        })),
        topCountries: topOrgCountries.map(item => ({
          country: item.country,
          count: Number(item.count),
        })),
        mostLiked: mostLikedOrgs,
        mostDisliked: mostDislikedOrgs,
      },
      people: {
        total: Number(peopleCount[0]?.count) || 0,
        bySide: peopleBySide.map(item => ({
          side: item.side,
          count: Number(item.count),
        })),
        topFields: topFields.map(item => ({
          field: item.field,
          count: Number(item.count),
        })),
        topCountries: topPeopleCountries.map(item => ({
          country: item.country,
          count: Number(item.count),
        })),
        mostLiked: mostLikedPeople,
        mostDisliked: mostDislikedPeople,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
