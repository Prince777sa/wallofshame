import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { linkTitles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Check if title is already cached in database
    const cachedTitle = await db
      .select()
      .from(linkTitles)
      .where(eq(linkTitles.url, url))
      .limit(1);

    if (cachedTitle.length > 0) {
      return NextResponse.json({ title: cachedTitle[0].title });
    }

    // If not cached, fetch from URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return NextResponse.json({ title: "" }, { status: 200 });
    }

    const html = await response.text();

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Cache the title in database for future use
    if (title) {
      try {
        await db.insert(linkTitles).values({ url, title });
      } catch (error) {
        // Ignore duplicate errors
        console.log("Title already cached:", url);
      }
    }

    return NextResponse.json({ title });
  } catch (error) {
    console.error("Error fetching title:", error);
    return NextResponse.json({ title: "" }, { status: 200 });
  }
}
