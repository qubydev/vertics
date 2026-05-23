import { NextResponse } from "next/server";
import { db } from "@/db";
import { site, analyticsEvent } from "@/db/schema";
import { eq, and, count, countDistinct } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function GET(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const siteId = req.nextUrl.searchParams.get("siteId");

    if (!siteId) {
        return NextResponse.json({ error: "Missing site ID" }, { status: 400 });
    }

    const siteRecord = await db.select()
        .from(site)
        .where(and(eq(site.id, siteId), eq(site.userId, userId)))
        .limit(1);

    if (!siteRecord.length) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const targetSite = siteRecord[0];

    const statsResult = await db.select({
        views: count(analyticsEvent.id),
        visits: countDistinct(analyticsEvent.sessionId),
        visitors: countDistinct(analyticsEvent.sessionId)
    })
        .from(analyticsEvent)
        .where(eq(analyticsEvent.siteToken, targetSite.token));

    return NextResponse.json({
        site: targetSite,
        stats: {
            views: statsResult[0].views || 0,
            visits: statsResult[0].visits || 0,
            visitors: statsResult[0].visitors || 0
        }
    });
}