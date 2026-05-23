import { NextResponse } from "next/server";
import { db } from "@/db";
import { site } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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
    const sites = await db.select().from(site).where(eq(site.userId, userId));
    return NextResponse.json(sites);
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

    const newSite = await db.insert(site).values({
        id,
        userId,
        name,
        domain: cleanDomain,
        token,
        createdAt: now,
        updatedAt: now,
    }).returning();

    return NextResponse.json(newSite[0]);
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

    const updatedSite = await db.update(site)
        .set({ name, domain: cleanDomain, updatedAt: new Date() })
        .where(and(eq(site.id, id), eq(site.userId, userId)))
        .returning();

    return NextResponse.json(updatedSite[0]);
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

    await db.delete(site).where(and(eq(site.id, id), eq(site.userId, userId)));
    return NextResponse.json({ success: true });
}