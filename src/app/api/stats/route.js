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
        return NextResponse.json({ error: "Website not found" }, { status: 404 });
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
                    sessionPageviews: new Map(),
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
                    sessionPageviews: new Map(),
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
                    sessionPageviews: new Map(),
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

    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));

    const events = await db.select()
        .from(analyticsEvent)
        .where(and(
            eq(analyticsEvent.siteId, targetSite.id),
            gte(analyticsEvent.timestamp, previousStartDate)
        ));

    const getEventTime = (event) => new Date(event.timestamp).getTime();
    const currentEvents = events.filter(event => getEventTime(event) >= startDate.getTime());
    const previousEvents = events.filter(event => {
        const eventTime = getEventTime(event);
        return eventTime >= previousStartDate.getTime() && eventTime < startDate.getTime();
    });
    const pageviewEvents = currentEvents.filter(event => event.eventName === "pageview");

    let views = 0;
    const uniqueSessions = new Set();
    const uniqueVisitors = new Set();
    const sessionPageviews = new Map();
    const timeseriesMap = buildTimeseriesSeed();
    const pagesMap = new Map();
    const referrersMap = new Map();
    const countriesMap = new Map();
    const browsersMap = new Map();
    const devicesMap = new Map();
    const osMap = new Map();

    pageviewEvents.forEach(event => {
        views += 1;
        uniqueSessions.add(event.sessionId);
        sessionPageviews.set(event.sessionId, (sessionPageviews.get(event.sessionId) || 0) + 1);

        // Ensure visitorId exists before adding (to gracefully handle older schema data if any)
        if (event.visitorId) {
            uniqueVisitors.add(event.visitorId);
        }

        const d = new Date(event.timestamp);
        const timeKey = createBucketKey(d);

        if (!timeseriesMap.has(timeKey)) {
            timeseriesMap.set(timeKey, {
                date: createBucketLabel(d),
                sortKey: timeKey,
                views: 0,
                visits: new Set(),
                sessionPageviews: new Map(),
            });
        }

        const tsData = timeseriesMap.get(timeKey);
        tsData.views += 1;
        tsData.sessionPageviews.set(event.sessionId, (tsData.sessionPageviews.get(event.sessionId) || 0) + 1);

        // Track unique visitors per time bucket instead of just sessions
        if (event.visitorId) {
            tsData.visits.add(event.visitorId);
        } else {
            tsData.visits.add(event.sessionId);
        }

        const page = event.pathname || "/"; // Updated to new column name
        pagesMap.set(page, (pagesMap.get(page) || 0) + 1);

        const referrer = event.referrer || "Direct";
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

    const bouncedSessions = Array.from(sessionPageviews.values()).filter(pageviewCount => pageviewCount === 1).length;
    const bounceRate = uniqueSessions.size > 0 ? Math.round((bouncedSessions / uniqueSessions.size) * 100) : 0;

    const summarizeTrendMetrics = (rangeEvents) => {
        const rangePageviews = rangeEvents.filter(event => event.eventName === "pageview");
        const rangeVisitors = new Set();
        const rangeSessions = new Set();
        const rangeSessionPageviews = new Map();

        rangePageviews.forEach(event => {
            rangeSessions.add(event.sessionId);

            if (event.visitorId) {
                rangeVisitors.add(event.visitorId);
            }

            rangeSessionPageviews.set(event.sessionId, (rangeSessionPageviews.get(event.sessionId) || 0) + 1);
        });

        const rangeBounces = Array.from(rangeSessionPageviews.values()).filter(pageviewCount => pageviewCount === 1).length;

        return {
            visitors: rangeVisitors.size > 0 ? rangeVisitors.size : rangeSessions.size,
            views: rangePageviews.length,
            bounceRate: rangeSessions.size > 0 ? Math.round((rangeBounces / rangeSessions.size) * 100) : 0
        };
    };

    const calculateChange = (current, previous) => {
        if (previous === 0) return current === 0 ? 0 : 100;
        return Math.round(((current - previous) / previous) * 100);
    };

    const currentTrendMetrics = {
        visitors: uniqueVisitors.size > 0 ? uniqueVisitors.size : uniqueSessions.size,
        views,
        bounceRate
    };
    const previousTrendMetrics = summarizeTrendMetrics(previousEvents);
    const trends = {
        visitors: calculateChange(currentTrendMetrics.visitors, previousTrendMetrics.visitors),
        views: calculateChange(currentTrendMetrics.views, previousTrendMetrics.views),
        bounceRate: calculateChange(currentTrendMetrics.bounceRate, previousTrendMetrics.bounceRate)
    };

    const realtimeCutoff = new Date(now.getTime() - 5 * 60 * 1000);
    const realtimeEventsByVisitor = new Map();

    currentEvents
        .filter(event => (
            getEventTime(event) >= realtimeCutoff.getTime() &&
            (event.eventName === "pageview" || event.eventName === "heartbeat")
        ))
        .forEach(event => {
            const key = event.visitorId || event.sessionId;
            const previousEvent = realtimeEventsByVisitor.get(key);

            if (!previousEvent || getEventTime(event) > getEventTime(previousEvent)) {
                realtimeEventsByVisitor.set(key, event);
            }
        });

    const timeseries = Array.from(timeseriesMap.values())
        .sort((a, b) => a.sortKey - b.sortKey)
        .map(t => {
            const bucketSessions = t.visits.size;
            const bucketBounces = Array.from(t.sessionPageviews.values()).filter(pageviewCount => pageviewCount === 1).length;

            return {
                date: t.date,
                views: t.views,
                visits: bucketSessions,
                bounceRate: bucketSessions > 0 ? Math.round((bucketBounces / bucketSessions) * 100) : 0,
            };
        });

    const sortMap = (map) => Array.from(map.entries())
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    return NextResponse.json({
        site: targetSite,
        stats: {
            views,
            visits: uniqueSessions.size,
            visitors: currentTrendMetrics.visitors,
            bounceRate,
            trends,
            realtime: {
                activeVisitors: realtimeEventsByVisitor.size,
            },
            timeseries,
            topPages: sortMap(pagesMap),
            topReferrers: sortMap(referrersMap),
            topCountries: sortMap(countriesMap),
            topBrowsers: sortMap(browsersMap),
            topDevices: sortMap(devicesMap),
            topOs: sortMap(osMap)
        }
    });
}
