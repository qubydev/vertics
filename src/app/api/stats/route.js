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

    const pad2 = (value) => value.toString().padStart(2, "0");

    const startOfDay = (date) => {
        const nextDate = new Date(date);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate;
    };

    const startOfMonth = (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(1);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate;
    };

    const createBucketLabel = (date) => {
        if (timeRange === "24h") {
            return `${pad2(date.getHours())}:00`;
        }

        if (timeRange === "1y") {
            return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }

        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const createBucketKey = (date) => {
        if (timeRange === "24h") {
            const nextDate = new Date(date);
            nextDate.setMinutes(0, 0, 0);
            return nextDate.getTime();
        }

        if (timeRange === "1y") {
            return startOfMonth(date).getTime();
        }

        return startOfDay(date).getTime();
    };

    const normalizeReferrer = (value) => {
        if (!value || value === "null") return null;

        try {
            const refUrl = new URL(value);

            const allowedHost = targetSite.domain.replace(/^www\./, "");

            if (refUrl.hostname.replace(/^www\./, "") === allowedHost) return null;
            if (refUrl.hostname === "localhost" || refUrl.hostname === "127.0.0.1" || refUrl.hostname === "::1") return null;

            return refUrl.hostname.replace(/^www\./, "") || refUrl.origin;
        } catch {
            return value.replace(/^https?:\/\//, "").replace(/^www\./, "");
        }
    };

    const buildTimeseriesSeed = () => {
        const buckets = new Map();

        if (timeRange === "24h") {
            for (let offset = 23; offset >= 0; offset -= 1) {
                const bucketDate = new Date(now.getTime() - offset * 60 * 60 * 1000);
                const bucketKey = createBucketKey(bucketDate);

                buckets.set(bucketKey, {
                    date: createBucketLabel(bucketDate),
                    sortKey: bucketKey,
                    views: 0,
                    visits: new Set(),
                });
            }
            return buckets;
        }

        if (timeRange === "7d" || timeRange === "30d" || timeRange === "3mo") {
            const bucketCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
            const bucketDate = startOfDay(now);
            bucketDate.setDate(bucketDate.getDate() - (bucketCount - 1));

            for (let index = 0; index < bucketCount; index += 1) {
                const currentBucketDate = new Date(bucketDate);
                currentBucketDate.setDate(bucketDate.getDate() + index);
                const bucketKey = createBucketKey(currentBucketDate);

                buckets.set(bucketKey, {
                    date: createBucketLabel(currentBucketDate),
                    sortKey: bucketKey,
                    views: 0,
                    visits: new Set(),
                });
            }
        }

        if (timeRange === "1y") {
            const bucketDate = startOfMonth(now);
            bucketDate.setMonth(bucketDate.getMonth() - 11);

            for (let index = 0; index < 12; index += 1) {
                const currentBucketDate = new Date(bucketDate);
                currentBucketDate.setMonth(bucketDate.getMonth() + index);
                const bucketKey = createBucketKey(currentBucketDate);

                buckets.set(bucketKey, {
                    date: createBucketLabel(currentBucketDate),
                    sortKey: bucketKey,
                    views: 0,
                    visits: new Set(),
                });
            }
        }

        return buckets;
    };

    const startDate = (() => {
        if (timeRange === "24h") {
            return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        if (timeRange === "7d") {
            const date = startOfDay(now);
            date.setDate(date.getDate() - 6);
            return date;
        }

        if (timeRange === "30d") {
            const date = startOfDay(now);
            date.setDate(date.getDate() - 29);
            return date;
        }

        if (timeRange === "3mo") {
            const date = startOfDay(now);
            date.setDate(date.getDate() - 89);
            return date;
        }

        if (timeRange === "1y") {
            const date = startOfMonth(now);
            date.setMonth(date.getMonth() - 11);
            return date;
        }

        return new Date(0);
    })();

    const events = await db.select()
        .from(analyticsEvent)
        .where(and(
            eq(analyticsEvent.siteToken, targetSite.token),
            gte(analyticsEvent.timestamp, startDate)
        ));

    const views = events.length;
    const uniqueSessions = new Set();
    const timeseriesMap = buildTimeseriesSeed();
    const pagesMap = new Map();
    const referrersMap = new Map();
    const countriesMap = new Map();
    const browsersMap = new Map();
    const devicesMap = new Map();
    const osMap = new Map();

    events.forEach(event => {
        uniqueSessions.add(event.sessionId);

        const d = new Date(event.timestamp);
        const timeKey = createBucketKey(d);

        if (!timeseriesMap.has(timeKey)) {
            timeseriesMap.set(timeKey, {
                date: createBucketLabel(d),
                sortKey: timeKey,
                views: 0,
                visits: new Set(),
            });
        }

        const tsData = timeseriesMap.get(timeKey);
        tsData.views += 1;
        tsData.visits.add(event.sessionId);

        const page = event.url || "/";
        pagesMap.set(page, (pagesMap.get(page) || 0) + 1);

        const referrer = normalizeReferrer(event.referrer) || "Direct";
        referrersMap.set(referrer, (referrersMap.get(referrer) || 0) + 1);

        const country = event.country || "Unknown";
        countriesMap.set(country, (countriesMap.get(country) || 0) + 1);

        const browser = event.browser || "Unknown";
        browsersMap.set(browser, (browsersMap.get(browser) || 0) + 1);

        const device = event.deviceType || "Unknown";
        devicesMap.set(device, (devicesMap.get(device) || 0) + 1);

        const os = event.os || "Unknown";
        osMap.set(os, (osMap.get(os) || 0) + 1);
    });

    const timeseries = Array.from(timeseriesMap.values())
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(t => ({
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
            ,
            topOs: sortMap(osMap)
        }
    });
}