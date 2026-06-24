import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { SiteAnalyticsView } from "@/components/analytics/site-analytics-view";
import { isAdminSession } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminSiteStatsPage({ params }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (!isAdminSession(session)) {
        redirect("/dashboard");
    }

    const { siteId } = await params;

    return (
        <div className="min-h-screen bg-background pt-18 sm:pt-24">
            <div className="fixed top-0 left-0 z-50 flex w-screen items-center justify-center">
                <div className="w-full max-w-264 sm:px-4 sm:pt-4">
                    <Navbar />
                </div>
            </div>
            <SiteAnalyticsView siteId={siteId} statsEndpoint="/api/admin/stats" />
        </div>
    );
}
