"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CountryPaths } from "../world-map";
import Image from "next/image";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";

function VisitorTrendsCard() {
    const [timeRange, setTimeRange] = useState("7d");

    const allData = {
        "24h": [
            { date: "00h", visitors: 40 },
            { date: "04h", visitors: 80 },
            { date: "08h", visitors: 120 },
            { date: "12h", visitors: 200 },
            { date: "16h", visitors: 160 },
            { date: "20h", visitors: 220 },
        ],
        "7d": [
            { date: "Mon", visitors: 120 },
            { date: "Tue", visitors: 180 },
            { date: "Wed", visitors: 140 },
            { date: "Thu", visitors: 220 },
            { date: "Fri", visitors: 300 },
            { date: "Sat", visitors: 260 },
            { date: "Sun", visitors: 340 }
        ],
        "30d": [
            { date: "W1", visitors: 900 },
            { date: "W2", visitors: 1200 },
            { date: "W3", visitors: 1100 },
            { date: "W4", visitors: 1500 }
        ],
        "3mo": [
            { date: "Oct", visitors: 4200 },
            { date: "Nov", visitors: 5100 },
            { date: "Dec", visitors: 4800 }
        ],
        "1y": [
            { date: "Jan", visitors: 12000 },
            { date: "Feb", visitors: 15000 },
            { date: "Mar", visitors: 14000 },
            { date: "Apr", visitors: 17000 },
            { date: "May", visitors: 19000 },
            { date: "Jun", visitors: 22000 }
        ]
    };

    const data = useMemo(() => allData[timeRange] || [], [timeRange]);

    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-6 bg-card border p-4 flex flex-col items-start gap-2">

            <div className="w-full flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-tight text-foreground">
                    Visitor Trends
                </h2>

                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40 bg-card">
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
            </div>

            <div className="w-full aspect-[3/1] min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="miniChartFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-foreground)" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="var(--color-foreground)" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />

                        <XAxis
                            dataKey="date"
                            stroke="var(--color-muted-foreground)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            stroke="var(--color-muted-foreground)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-background)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "0",
                                padding: "6px 10px"
                            }}
                            itemStyle={{
                                color: "var(--color-foreground)",
                                fontSize: "12px",
                                fontWeight: 600
                            }}
                            labelStyle={{
                                color: "var(--color-muted-foreground)",
                                fontSize: "10px"
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="var(--color-foreground)"
                            strokeWidth={2}
                            fill="url(#miniChartFill)"
                            activeDot={{ r: 3, fill: "var(--color-foreground)" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const WorldMapCard = () => {
    const svgRef = useRef(null);
    const gRef = useRef(null);

    // Dummy data - replace with your actual prop/state later
    const heatMapData = {
        US: 1500,
        IN: 1200,
        CN: 900,
        GB: 850,
        DE: 700,
        FR: 650,
        CA: 600,
        AU: 500,
        BR: 450,
        RU: 300,
        ZA: 150,
        JP: 800,
        MX: 400
    };

    const maxHeat = Math.max(...Object.values(heatMapData));

    const heatMapStyles = Object.entries(heatMapData).map(([code, value]) => {
        const opacity = Math.max(0.15, value / maxHeat).toFixed(2);
        return `#${code} { fill: var(--primary) !important; fill-opacity: ${opacity} !important; }`;
    }).join("\n");

    useEffect(() => {
        if (!svgRef.current || !gRef.current) return;

        const svg = select(svgRef.current);
        const width = 1008;
        const height = 654;

        const zoomBehavior = zoom()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                select(gRef.current).attr("transform", event.transform);
            });

        svg.call(zoomBehavior);

        const initialScale = 2;
        const initialTransform = zoomIdentity
            .translate(width / 2, height / 2)
            .scale(initialScale)
            .translate(-width / 2, -height / 2);

        svg.call(zoomBehavior.transform, initialTransform);

        return () => svg.on(".zoom", null);
    }, []);

    return (
        <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-4 flex flex-col gap-2 overflow-hidden">
            <h2 className="uppercase font-bold">World heatmap</h2>

            <style>{`
                ${heatMapStyles}
            `}</style>

            <div className="w-full aspect-square relative overflow-hidden bg-background/50 flex items-center justify-center">
                <svg
                    ref={svgRef}
                    className="world-map w-full h-full block"
                    viewBox="0 0 1008 654"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ touchAction: "none", cursor: "grab" }}
                >
                    <g ref={gRef}>
                        <CountryPaths />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default function Features() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <h1 className="text-center font-bold text-2xl md:text-3xl tracking-tighter mb-20">
                Detailed <span className="text-muted-foreground">Analytics</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 md:gap-6">
                <VisitorTrendsCard />

                <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 bg-card border p-4 flex flex-col gap-2">
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Global Audience</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Explore visitors across the world with an interactive geographic overview.
                        </p>
                    </div>

                    <img
                        src="/logo.png"
                        alt="Global Audience"
                        className="w-full flex-1 aspect-square object-contain"
                    />

                    <div className="bg-secondary flex-1"></div>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-4 flex flex-col gap-2">
                    <img
                        src="/logo.png"
                        alt="Traffic Breakdown"
                        className="w-full flex-1 aspect-square object-contain"
                    />
                </div>

                <WorldMapCard />
            </div>
        </div>
    );
}