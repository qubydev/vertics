"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatList } from "@/components/analytics/stat-list";
import { TabStatCard } from "@/components/analytics/tab-stat-card";
import { MetricCards } from "@/components/analytics/metric-cards";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { DashboardHeader } from "@/components/analytics/dashboard-header";

export default function SiteStatsPage() {
    const params = useParams();
    const siteId = params.siteId;
    const [site, setSite] = useState(null);
    const [timeRange, setTimeRange] = useState("7d");
    const [activeMetric, setActiveMetric] = useState("visitors");
    const [stats, setStats] = useState({
        visitors: 0,
        visits: 0,
        views: 0,
        timeseries: [],
        topPages: [],
        topReferrers: [],
        topCountries: [],
        topBrowsers: [],
        topDevices: [],
        topOs: []
    });

    useEffect(() => {
        if (siteId) {
            fetch(`/api/stats?siteId=${siteId}&timeRange=${timeRange}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.site) {
                        setSite(data.site);
                        setStats(data.stats);
                    }
                });
        }
    }, [siteId, timeRange]);

    const metricConfig = {
        visitors: { label: "Unique Visitors", value: stats.visitors, dataKey: "visits" },
        views: { label: "Page Views", value: stats.views, dataKey: "views" }
    };

    return (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 min-h-screen bg-background">
            <DashboardHeader
                site={site}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
            />

            <Card className="w-full flex flex-col">
                <MetricCards
                    metricConfig={metricConfig}
                    activeMetric={activeMetric}
                    setActiveMetric={setActiveMetric}
                />
                <div className="w-full h-[360px] p-6">
                    <AnalyticsChart
                        data={stats.timeseries}
                        activeSeriesKey={metricConfig[activeMetric].dataKey}
                    />
                </div>
            </Card>

            <div className="w-full flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <StatList title="Top Pages" data={stats.topPages} metricLabel="Views" type="page" />
                    <StatList title="Referrers" data={stats.topReferrers} metricLabel="Referrals" type="referrer" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatList title="Countries" data={stats.topCountries} metricLabel="Visitors" type="country" />
                    <TabStatCard
                        leftTitle="Devices"
                        rightTitle="Browsers"
                        leftData={stats.topDevices}
                        rightData={stats.topBrowsers}
                        leftType="device"
                        rightType="browser"
                    />
                    <StatList title="Operating Systems" data={stats.topOs || []} metricLabel="Visitors" type="os" />
                </div>
            </div>
        </main>
    );
}