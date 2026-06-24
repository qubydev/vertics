"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatList } from "@/components/analytics/stat-list";
import { TabStatCard } from "@/components/analytics/tab-stat-card";
import { MetricCards } from "@/components/analytics/metric-cards";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { DashboardHeader } from "@/components/analytics/dashboard-header";
import { WorldMap } from "@/components/world-map";

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
        bounceRate: 0,
        trends: {
            visitors: 0,
            views: 0,
            bounceRate: 0
        },
        realtime: {
            activeVisitors: 0,
        },
        timeseries: [],
        topPages: [],
        topReferrers: [],
        topCountries: [],
        topBrowsers: [],
        topDevices: [],
        topOs: []
    });

    useEffect(() => {
        if (!siteId) return;

        let cancelled = false;

        const fetchStats = () => {
            fetch(`/api/stats?siteId=${siteId}&timeRange=${timeRange}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!cancelled && data.site) {
                        setSite(data.site);
                        setStats(data.stats);
                    }
                });
        };

        fetchStats();
        const interval = setInterval(fetchStats, 15000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [siteId, timeRange]);

    const metricConfig = {
        visitors: {
            label: "Unique Visitors",
            value: stats.visitors,
            dataKey: "visits",
            trend: stats.trends?.visitors || 0
        },
        views: {
            label: "Page Views",
            value: stats.views,
            dataKey: "views",
            trend: stats.trends?.views || 0
        },
        bounceRate: {
            label: "Bounce Rate",
            value: stats.bounceRate || 0,
            dataKey: "bounceRate",
            formatValue: (value) => `${value}%`,
            trend: stats.trends?.bounceRate || 0,
            trendDirection: "inverse"
        }
    };

    const activeSeriesKey = metricConfig[activeMetric]?.dataKey || metricConfig.visitors.dataKey;

    const visitorsByCountry = useMemo(() => {
        return (stats.topCountries || []).reduce((heatMap, country) => {
            const code = country.name?.toUpperCase();

            if (!code || code === "LOCAL" || code === "UNKNOWN") {
                return heatMap;
            }

            heatMap[code] = country.views || 0;
            return heatMap;
        }, {});
    }, [stats.topCountries]);

    const totalMappedVisitors = Object.values(visitorsByCountry).reduce((total, value) => total + value, 0);

    return (
        <main className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8 min-h-screen bg-background">
            <DashboardHeader
                site={site}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                activeVisitors={stats.realtime?.activeVisitors || 0}
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
                        activeSeriesKey={activeSeriesKey}
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
                <Card className="w-full flex flex-col">
                    <div className="pt-4 px-6 pb-0 space-y-0 shrink-0">
                        <div className="flex justify-between items-end w-full border-b border-border">
                            <div className="pb-3 text-sm font-bold uppercase tracking-tight border-b-2 border-foreground text-foreground -mb-[2px]">
                                Visitor Map
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight pb-3">
                                {totalMappedVisitors.toLocaleString()} Visitors
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 p-4 md:p-6">
                        {totalMappedVisitors > 0 ? (
                            <div className="w-full">
                                <WorldMap heatMap={visitorsByCountry} aria-label="Visitor heatmap by country" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[320px]">
                                <span className="text-sm font-bold uppercase tracking-tight text-muted-foreground">No location data available</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    );
}
