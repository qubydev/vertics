"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { ArrowLeft, Globe, LogOut } from "lucide-react";
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
        <Card className="w-full flex flex-col h-90 shadow-sm overflow-hidden">
            <CardHeader className="py-4 border-b shrink-0">
                <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visitors</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-0 overflow-y-auto">
                {data.length > 0 ? (
                    <div className="flex flex-col w-full h-full gap-2 p-4">
                        {data.map((item, i) => {
                            return (
                                <div key={i} className="flex items-center justify-between gap-4 rounded-md bg-muted/30 px-4 py-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                                        <span className="truncate text-sm font-medium w-full">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold tabular-nums shrink-0">{item.views}</span>
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

function TabStatCard({ leftTitle, rightTitle, leftData, rightData }) {
    const [active, setActive] = useState("left");

    const data = active === "left" ? leftData : rightData;
    const title = active === "left" ? leftTitle : rightTitle;

    return (
        <Card className="w-full flex flex-col h-90 shadow-sm overflow-hidden">
            <CardHeader className="py-4 border-b shrink-0">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActive("left")} className={`text-sm font-medium ${active === "left" ? "underline" : "text-muted-foreground"}`}>{leftTitle}</button>
                        <button onClick={() => setActive("right")} className={`text-sm font-medium ${active === "right" ? "underline" : "text-muted-foreground"}`}>{rightTitle}</button>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Page Views</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-0 overflow-y-auto">
                {data.length > 0 ? (
                    <div className="flex flex-col w-full h-full gap-2 p-4">
                        {data.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 rounded-md bg-muted/30 px-4 py-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                                    <span className="truncate text-sm font-medium w-full">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold tabular-nums shrink-0">{item.views}</span>
                            </div>
                        ))}
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
        ,topOs: []
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

    const activeSeriesKey = metricConfig[activeMetric].dataKey;

    const userInitials = session?.user?.name
      ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";

    return (
        <main className="w-full max-w-300 mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen">

            <div className="flex w-full items-center justify-between pb-4">
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
                        <h1 className="text-lg font-semibold">{site.name || site.domain}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-45 h-9">
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="3mo">Last 3 months</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <Avatar>
                                <AvatarImage src={session.user.image} alt={session.user.name} />
                                <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={async () => {
                                    await authClient.signOut();
                                    router.replace("/");
                                }}
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card className="w-full shadow-sm overflow-hidden">

                <div className="flex w-full border-b overflow-x-auto">
                    {Object.entries(metricConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveMetric(key)}
                            className={`flex flex-col gap-1 px-6 py-4 min-w-35 text-left transition-colors border-r hover:bg-muted/30 ${activeMetric === key
                                    ? "bg-muted/10 shadow-[inset_0_-2px_0_0_hsl(var(--foreground))]"
                                    : ""
                                }`}
                        >
                            <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
                            <span className="text-3xl font-bold">{config.value.toLocaleString()}</span>
                        </button>
                    ))}
                </div>

                <div className="w-full h-87.5 p-6 pt-8">
                    {stats.timeseries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.timeseries} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                                    dataKey={activeSeriesKey}
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

            <div className="w-full flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <StatList title="Pages" data={stats.topPages} />
                    <StatList title="Referrers" data={stats.topReferrers} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatList title="Countries" data={stats.topCountries} />
                    <TabStatCard
                        leftTitle="Devices"
                        rightTitle="Browsers"
                        leftData={stats.topDevices}
                        rightData={stats.topBrowsers}
                    />
                    <StatList title="Operating Systems" data={stats.topOs || []} />
                </div>
            </div>

        </main>
    );
}