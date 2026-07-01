import { NextResponse } from "next/server";
import { collections, withoutMongoId } from "@/db";
import crypto from "crypto";
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
    const sites = await collections.sites
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

    return NextResponse.json(sites.map(withoutMongoId));
}

export async function POST(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { name, domain } = body;

    if (!name || !domain) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const token = crypto.randomUUID();
    const now = new Date();

    let cleanDomain = domain;
    try {
        const urlString = domain.startsWith("http") ? domain : `http://${domain}`;
        cleanDomain = new URL(urlString).hostname.replace(/^www\./, "");
    } catch (e) {
        cleanDomain = domain.replace(/^www\./, "");
    }

    const newSite = {
        id,
        userId,
        name,
        domain: cleanDomain,
        token,
        createdAt: now,
        updatedAt: now,
    };

    await collections.sites.insertOne(newSite);

    return NextResponse.json(newSite);
}

export async function PUT(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { id, name, domain } = body;

    if (!id || !name || !domain) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let cleanDomain = domain;
    try {
        const urlString = domain.startsWith("http") ? domain : `http://${domain}`;
        cleanDomain = new URL(urlString).hostname.replace(/^www\./, "");
    } catch (e) {
        cleanDomain = domain.replace(/^www\./, "");
    }

    const updatedSite = await collections.sites.findOneAndUpdate(
        { id, userId },
        { $set: { name, domain: cleanDomain, updatedAt: new Date() } },
        { returnDocument: "after" }
    );

    if (!updatedSite) {
        return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    return NextResponse.json(withoutMongoId(updatedSite));
}

export async function DELETE(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing site ID" }, { status: 400 });
    }

    await collections.analyticsEvents.deleteMany({ siteId: id });
    await collections.sites.deleteOne({ id, userId });

    return NextResponse.json({ success: true });
}
