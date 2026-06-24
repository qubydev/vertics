import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getAnalyticsStats } from "@/lib/analytics-stats";
import { isAdminSession } from "@/lib/admin";

export async function GET(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdminSession(session)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const siteId = req.nextUrl.searchParams.get("siteId");
    const timeRange = req.nextUrl.searchParams.get("timeRange") || "7d";

    if (!siteId) {
        return NextResponse.json({ error: "Missing site ID" }, { status: 400 });
    }

    const data = await getAnalyticsStats({
        siteId,
        timeRange,
        allowAnySite: true,
    });

    if (!data) {
        return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
