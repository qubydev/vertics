import { NextResponse } from "next/server";
import { db } from "@/db";
import { site, user } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { isAdminSession } from "@/lib/admin";

export async function GET(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const isAdmin = isAdminSession(session);

    if (isAdmin) {
        const sites = await db.select({
            id: site.id,
            userId: site.userId,
            name: site.name,
            domain: site.domain,
            token: site.token,
            createdAt: site.createdAt,
            updatedAt: site.updatedAt,
            ownerName: user.name,
            ownerEmail: user.email,
        })
            .from(site)
            .leftJoin(user, eq(site.userId, user.id))
            .orderBy(desc(site.createdAt));

        return NextResponse.json({
            isAdmin,
            sites: sites.map((trackedSite) => ({
                ...trackedSite,
                isOwner: trackedSite.userId === userId,
            })),
        });
    }

    const sites = await db.select().from(site).where(eq(site.userId, userId));
    return NextResponse.json({
        isAdmin,
        sites: sites.map((trackedSite) => ({
            ...trackedSite,
            isOwner: true,
        })),
    });
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
