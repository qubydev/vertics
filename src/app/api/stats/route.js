import { NextResponse } from "next/server";
import { db } from "@/db";
import { site, analyticsEvent } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
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
    const timeRange = req.nextUrl.searchParams.get("timeRange") || "7d";

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

    const now = new Date();
    let startDate = new Date(0);

    if (timeRange === "24h") {
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (timeRange === "7d") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "30d") {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const events = await db.select()
        .from(analyticsEvent)
        .where(and(
            eq(analyticsEvent.siteToken, targetSite.token),
            gte(analyticsEvent.timestamp, startDate)
        ));

    const views = events.length;
    const uniqueSessions = new Set();
    const timeseriesMap = new Map();
    const pagesMap = new Map();
    const referrersMap = new Map();
    const countriesMap = new Map();
    const browsersMap = new Map();
    const devicesMap = new Map();

    events.forEach(event => {
        uniqueSessions.add(event.sessionId);

        let timeKey = "";
        const d = new Date(event.timestamp);

        if (timeRange === "24h") {
            timeKey = `${d.getHours().toString().padStart(2, '0')}:00`;
        } else {
            timeKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (!timeseriesMap.has(timeKey)) {
            timeseriesMap.set(timeKey, { date: timeKey, views: 0, visits: new Set() });
        }

        const tsData = timeseriesMap.get(timeKey);
        tsData.views += 1;
        tsData.visits.add(event.sessionId);

        const page = event.url || "/";
        pagesMap.set(page, (pagesMap.get(page) || 0) + 1);

        const referrer = event.referrer && event.referrer !== "null" ? event.referrer : "Direct";
        referrersMap.set(referrer, (referrersMap.get(referrer) || 0) + 1);

        const country = event.country || "Unknown";
        countriesMap.set(country, (countriesMap.get(country) || 0) + 1);

        const browser = event.browser || "Unknown";
        browsersMap.set(browser, (browsersMap.get(browser) || 0) + 1);

        const device = event.deviceType || "Unknown";
        devicesMap.set(device, (devicesMap.get(device) || 0) + 1);
    });

    const timeseries = Array.from(timeseriesMap.values()).map(t => ({
        date: t.date,
        views: t.views,
        visits: t.visits.size
    }));

    const sortMap = (map) => Array.from(map.entries())
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    return NextResponse.json({
        site: targetSite,
        stats: {
            views,
            visits: uniqueSessions.size,
            visitors: uniqueSessions.size,
            timeseries,
            topPages: sortMap(pagesMap),
            topReferrers: sortMap(referrersMap),
            topCountries: sortMap(countriesMap),
            topBrowsers: sortMap(browsersMap),
            topDevices: sortMap(devicesMap)
        }
    });
}