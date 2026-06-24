import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { BarChart3, Globe, Users } from "lucide-react";

import { AdminTabs } from "@/components/admin/admin-tabs";
import Navbar from "@/components/navbar";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { db } from "@/db";
import { analyticsEvent, site, user } from "@/db/schema";
import { isAdminSession } from "@/lib/admin";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("en-US");

function toNumber(value) {
    return Number(value || 0);
}

function formatNumber(value) {
    return numberFormatter.format(toNumber(value));
}

async function getAdminOverview() {
    const [
        totalUsersRows,
        totalSitesRows,
        pageviewsRows,
        visitorsRows,
        recentUsers,
        allSites,
    ] = await Promise.all([
        db.select({ value: sql`count(*)` }).from(user),
        db.select({ value: sql`count(*)` }).from(site),
        db.select({ value: sql`count(*)` })
            .from(analyticsEvent)
            .where(eq(analyticsEvent.eventName, "pageview")),
        db.select({ value: sql`count(distinct ${analyticsEvent.visitorId})` })
            .from(analyticsEvent),
        db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
        })
            .from(user)
            .orderBy(desc(user.createdAt))
            .limit(8),
        db.select({
            id: site.id,
            userId: site.userId,
            name: site.name,
            domain: site.domain,
            token: site.token,
            createdAt: site.createdAt,
            updatedAt: site.updatedAt,
            ownerName: user.name,
            ownerEmail: user.email,
            events: sql`count(${analyticsEvent.id})`,
        })
            .from(site)
            .leftJoin(user, eq(site.userId, user.id))
            .leftJoin(analyticsEvent, eq(analyticsEvent.siteId, site.id))
            .groupBy(site.id, site.userId, site.name, site.domain, site.token, site.createdAt, site.updatedAt, user.name, user.email)
            .orderBy(desc(site.createdAt)),
    ]);

    return {
        totals: {
            users: toNumber(totalUsersRows[0]?.value),
            sites: toNumber(totalSitesRows[0]?.value),
            pageviews: toNumber(pageviewsRows[0]?.value),
            visitors: toNumber(visitorsRows[0]?.value),
        },
        recentUsers,
        sites: allSites.map((trackedSite) => ({
            ...trackedSite,
            events: toNumber(trackedSite.events),
        })),
    };
}

function MetricCard({ title, value, description, icon: Icon }) {
    return (
        <Card>
            <CardHeader className="grid grid-cols-[1fr_auto] gap-2 p-3 sm:p-4">
                <div>
                    <CardDescription className="text-xs font-bold uppercase tracking-tight">
                        {title}
                    </CardDescription>
                    <CardTitle className="mt-1 text-3xl leading-none sm:text-5xl">
                        {formatNumber(value)}
                    </CardTitle>
                    <p className="mt-1 text-xs leading-none text-muted-foreground">{description}</p>
                </div>
                <div className="flex size-8 items-center justify-center border bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                </div>
            </CardHeader>
        </Card>
    );
}

export default async function AdminPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (!isAdminSession(session)) {
        redirect("/dashboard");
    }

    const overview = await getAdminOverview();

    return (
        <div className="min-h-screen bg-background pt-18 sm:pt-24">
            <div className="fixed top-0 left-0 z-50 flex w-screen items-center justify-center">
                <div className="w-full max-w-264 sm:px-4 sm:pt-4">
                    <Navbar />
                </div>
            </div>

            <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-lg font-bold uppercase tracking-tight text-muted-foreground">
                        Admin
                    </h1>
                </div>

                <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <MetricCard title="Users" value={overview.totals.users} description="Accounts" icon={Users} />
                    <MetricCard title="Sites" value={overview.totals.sites} description="Properties" icon={Globe} />
                    <MetricCard title="Views" value={overview.totals.pageviews} description="Pageviews" icon={BarChart3} />
                    <MetricCard title="Visitors" value={overview.totals.visitors} description="Unique" icon={Users} />
                </section>

                <AdminTabs users={overview.recentUsers} sites={overview.sites} />
            </main>
        </div>
    );
}
