"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { ArrowLeft, Globe } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function StatList({ title, data }) {
    return (
        <Card className="w-full flex flex-col h-full shadow-sm">
            <CardHeader className="py-4 border-b">
                <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visitors</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-0">
                {data.length > 0 ? (
                    <div className="flex flex-col w-full h-full">
                        {data.map((item, i) => {
                            return (
                                <div key={i} className="flex justify-between items-center py-3 px-6 hover:bg-muted/50 transition-colors border-b last:border-0 relative">
                                    <div className="flex items-center gap-3 relative z-10 w-full overflow-hidden">
                                        <span className="truncate text-sm font-medium w-full">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-sm font-semibold">{item.views}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-1 py-12">
                        <span className="text-sm text-muted-foreground">No data available</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function SiteStatsPage() {
    const router = useRouter();
    const params = useParams();
    const siteId = params.siteId;
    const { data: session, isPending } = authClient.useSession();

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
        topDevices: []
    });

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/login");
        }
    }, [isPending, router, session]);

    useEffect(() => {
        if (session?.user?.id && siteId) {
            fetch(`/api/stats?siteId=${siteId}&timeRange=${timeRange}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.site) {
                        setSite(data.site);
                        setStats(data.stats);
                    }
                });
        }
    }, [session, siteId, timeRange]);

    if (isPending || !session || !site) {
        return null;
    }

    const metricConfig = {
        visitors: { label: "Visitors", value: stats.visitors, dataKey: "visits" },
        views: { label: "Page Views", value: stats.views, dataKey: "views" }
    };

    return (
        <main className="w-full max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="h-8 w-8 text-muted-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <h1 className="text-xl font-semibold">{site.domain}</h1>
                    </div>
                </div>

                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="w-full shadow-sm overflow-hidden">

                <div className="flex w-full border-b overflow-x-auto">
                    {Object.entries(metricConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveMetric(key)}
                            className={`flex flex-col gap-1 px-6 py-4 min-w-[140px] text-left transition-colors border-r hover:bg-muted/30 ${activeMetric === key
                                    ? "bg-muted/10 shadow-[inset_0_-2px_0_0_hsl(var(--foreground))]"
                                    : ""
                                }`}
                        >
                            <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
                            <span className="text-3xl font-bold">{config.value.toLocaleString()}</span>
                        </button>
                    ))}
                </div>

                <div className="w-full h-[350px] p-6 pt-8">
                    {stats.timeseries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.timeseries} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={metricConfig[activeMetric].dataKey}
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                    activeDot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No data available for this period.</span>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <StatList title="Pages" data={stats.topPages} />
                <StatList title="Referrers" data={stats.topReferrers} />
                <StatList title="Countries" data={stats.topCountries} />
                <StatList title="Devices" data={stats.topDevices} />
                <StatList title="Browsers" data={stats.topBrowsers} />
            </div>

        </main>
    );
}