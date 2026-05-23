import { db } from "@/db";
import { analyticsEvent, site } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getCountry(ip) {
    if (!ip || ip === "::1" || ip === "127.0.0.1") return 'LOCAL';
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
        const data = await res.json();
        return data.countryCode || null;
    } catch {
        return null;
    }
}

export async function POST(req) {
    const origin = req.headers.get("origin") || req.headers.get("referer");
    const body = await req.json();
    const { token, eventName, url, referrer, sessionId, deviceType, browser } = body;

    if (!token || !eventName || !url || !sessionId) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const siteRow = await db.query.site.findFirst({
        where: eq(site.token, token),
    });

    if (!siteRow) {
        return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    if (origin) {
        const incoming = new URL(origin).hostname.replace(/^www\./, "");
        const allowed = siteRow.domain.replace(/^www\./, "");
        if (incoming !== allowed) {
            return Response.json({ error: "Origin not allowed" }, { status: 403 });
        }
    }

    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        null;

    const country = await getCountry(ip);

    await db.insert(analyticsEvent).values({
        id: nanoid(),
        siteToken: token,
        timestamp: new Date(),
        url,
        referrer: referrer || null,
        sessionId,
        country,
        deviceType: deviceType || null,
        browser: browser || null,
        eventName,
    });

    return Response.json({ ok: true });
}