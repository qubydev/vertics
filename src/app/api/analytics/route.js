import { collections } from "@/db";
import crypto from "crypto";

function normalizeReferrer(referrer, currentOrigin) {
    if (!referrer) return null;
    try {
        const refUrl = new URL(referrer);
        if (currentOrigin && refUrl.origin === currentOrigin) return null;
        return refUrl.hostname.replace(/^www\./, "") || refUrl.origin;
    } catch {
        return referrer.replace(/^https?:\/\//, "").replace(/^www\./, "");
    }
}

async function getLocation(ip) {
    if (!ip || ip === "::1" || ip === "127.0.0.1") return { country: 'LOCAL', city: 'LOCAL' };
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode,city`);
        const data = await res.json();
        return {
            country: data.countryCode || null,
            city: data.city || null
        };
    } catch {
        return { country: null, city: null };
    }
}

export async function POST(req) {
    const origin = req.headers.get("origin") || req.headers.get("referer");
    const body = await req.json();
    const { token, eventName, pathname, duration, referrerUrl, sessionId, visitorId, deviceType, browser, os } = body;

    if (!token || !eventName || !pathname || !sessionId || !visitorId) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const siteRow = await collections.sites.findOne({ token });

    if (!siteRow) {
        return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    if (origin) {
        const incoming = new URL(origin).hostname.replace(/^www\./, "");
        const allowed = siteRow.domain.replace(/^www\./, "");
        if (incoming !== allowed && incoming !== "localhost" && incoming !== "127.0.0.1") {
            return Response.json({ error: "Origin not allowed" }, { status: 403 });
        }
    }

    const currentOrigin = origin ? new URL(origin).origin : null;
    const normalizedReferrer = normalizeReferrer(referrerUrl, currentOrigin);

    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        null;

    const location = eventName === "pageview"
        ? await getLocation(ip)
        : { country: null, city: null };

    await collections.analyticsEvents.insertOne({
        id: crypto.randomUUID(),
        siteId: siteRow.id,
        timestamp: new Date(),
        eventName,
        pathname,
        duration: duration || null,
        visitorId,
        sessionId,
        referrer: normalizedReferrer,
        referrerUrl: referrerUrl || null,
        country: location.country,
        city: location.city,
        deviceType: deviceType || null,
        browser: browser || null,
        os: os || null,
    });

    return Response.json({ ok: true });
}
