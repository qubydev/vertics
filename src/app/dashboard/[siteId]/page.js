"use client";

import { useParams } from "next/navigation";
import { SiteAnalyticsView } from "@/components/analytics/site-analytics-view";

export default function SiteStatsPage() {
    const params = useParams();
    return <SiteAnalyticsView siteId={params.siteId} />;
}
