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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Plus, Minus, RotateCcw, Globe, ArrowUp, ArrowDown } from "lucide-react";
import { CountryPaths } from "../world-map";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import GlobePreview from "@/components/globe"

export function StatList({ title, data, metricLabel = "Visitors", type = "default" }) {
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.views || 0)) : 1;

    const getDisplayName = (name) => {
        if (type === "country" && name !== "LOCAL" && name !== "Unknown") {
            try {
                return new Intl.DisplayNames(['en'], { type: 'region' }).of(name.toUpperCase());
            } catch {
                return name;
            }
        }
        return name || (type === "page" ? "/" : "Unknown");
    };

    const getIcon = (name) => {
        const lowerName = name?.toLowerCase() || '';

        if (type === "browser") {
            const known = ['chrome', 'edge', 'firefox', 'safari'];
            const iconName = known.includes(lowerName) ? lowerName : 'default';
            return <img src={`/browser/${iconName}.png`} alt={name} className="w-4 h-4 shrink-0 object-contain" />;
        }
        if (type === "os") {
            const known = ['android', 'iphone', 'linux', 'mac', 'windows'];
            const iconName = known.includes(lowerName) ? lowerName : 'default';
            return <img src={`/os/${iconName}.png`} alt={name} className="w-4 h-4 shrink-0 object-contain" />;
        }
        if (type === "device") {
            const known = ['desktop', 'phone', 'tablet'];
            const iconName = known.includes(lowerName) ? lowerName : 'desktop';
            return <img src={`/device/${iconName}.png`} alt={name} className="w-4 h-4 shrink-0 object-contain" />;
        }
        if (type === "country") {
            if (name === "LOCAL" || name === "Unknown" || !name) return <Globe className="w-4 h-4 text-muted-foreground shrink-0" />;
            return <img src={`https://flagcdn.com/24x18/${name.toLowerCase()}.png`} alt={name} className="w-[18px] h-[13.5px] object-cover shrink-0 shadow-sm" />;
        }
        if (type === "referrer") {
            if (name === "Direct" || !name) return <Globe className="w-4 h-4 text-muted-foreground shrink-0" />;
            return <img src={`https://www.google.com/s2/favicons?domain=${name}&sz=32`} alt={name} className="w-4 h-4 shrink-0 bg-white" />;
        }

        return <Globe className="w-4 h-4 text-muted-foreground shrink-0" />;
    };

    return (
        <Card className="w-full flex flex-col h-full">
            <CardHeader className="pt-4 px-6 pb-0 space-y-0 shrink-0">
                <div className="flex justify-between items-end w-full border-b border-border">
                    <div className="flex items-center">
                        <div className="pb-3 text-sm font-bold uppercase tracking-tight border-b-2 border-foreground text-foreground -mb-[2px]">
                            {title}
                        </div>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight pb-3">{metricLabel}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-0 overflow-y-auto">
                {data.length > 0 ? (
                    <div className="flex flex-col w-full h-full p-2">
                        {data.map((item, i) => {
                            const pct = Math.min(100, Math.max(0, ((item.views || 0) / maxVal) * 100));
                            return (
                                <div key={i} className="group relative flex items-center justify-between gap-4 px-4 py-2 hover:bg-muted/50 transition-colors">
                                    <div
                                        className="absolute left-1 top-1 bottom-1 bg-muted transition-all -z-10"
                                        style={{ width: `calc(${pct}% - 8px)`, opacity: 0.7 }}
                                    />
                                    <div className="flex items-center gap-3 min-w-0 flex-1 z-10">
                                        {getIcon(item.name)}
                                        <span className="truncate text-sm text-foreground font-medium">{getDisplayName(item.name)}</span>
                                    </div>
                                    <span className="text-sm font-medium text-foreground tabular-nums shrink-0 z-10">{item.views?.toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-1 py-12">
                        <span className="text-sm font-bold uppercase tracking-tight text-muted-foreground">No data available</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

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
                    <SelectTrigger className="w-40 bg-card rounded-none">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
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
    const zoomRef = useRef(null);
    const svgSelectionRef = useRef(null);

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

        svgSelectionRef.current = svg;
        zoomRef.current = zoomBehavior;

        svg.call(zoomBehavior);

        const initialScale = 2;
        const initialTransform = zoomIdentity
            .translate(width / 2, height / 2)
            .scale(initialScale)
            .translate(-width / 2, -height / 2);

        svg.call(zoomBehavior.transform, initialTransform);

        return () => svg.on(".zoom", null);
    }, []);

    const handleZoomIn = () => {
        if (svgSelectionRef.current && zoomRef.current) {
            svgSelectionRef.current.transition().duration(250).call(zoomRef.current.scaleBy, 1.5);
        }
    };

    const handleZoomOut = () => {
        if (svgSelectionRef.current && zoomRef.current) {
            svgSelectionRef.current.transition().duration(250).call(zoomRef.current.scaleBy, 0.66);
        }
    };

    const handleReset = () => {
        if (svgSelectionRef.current && zoomRef.current) {
            const width = 1008;
            const height = 654;
            const initialScale = 2;
            const initialTransform = zoomIdentity
                .translate(width / 2, height / 2)
                .scale(initialScale)
                .translate(-width / 2, -height / 2);

            svgSelectionRef.current.transition().duration(500).call(zoomRef.current.transform, initialTransform);
        }
    };

    return (
        <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-4 flex flex-col gap-2 overflow-hidden">
            <h2 className="text-sm font-semibold uppercase tracking-tight text-foreground">
                World heatmap
            </h2>

            <style>{heatMapStyles}</style>

            <div className="w-full aspect-square relative overflow-hidden bg-background/50 flex items-center justify-center">

                <div className="absolute bottom-4 right-4 flex flex-row gap-2 z-10">
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-none shadow-md opacity-95 hover:opacity-100" onClick={handleZoomIn}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-none shadow-md opacity-95 hover:opacity-100" onClick={handleZoomOut}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-none shadow-md opacity-95 hover:opacity-100" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>

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

const DemographicsCard = () => {
    const [activeTab, setActiveTab] = useState("browser");

    const mockData = {
        browser: [
            { name: "Chrome", views: 12500 },
            { name: "Safari", views: 4200 },
            { name: "Edge", views: 3800 },
            { name: "Firefox", views: 1500 },
            { name: "Brave", views: 800 }
        ],
        os: [
            { name: "Windows", views: 11000 },
            { name: "Mac", views: 5500 },
            { name: "iPhone", views: 4200 },
            { name: "Android", views: 3800 },
            { name: "Linux", views: 1200 }
        ],
        device: [
            { name: "Desktop", views: 15400 },
            { name: "Phone", views: 8200 },
            { name: "Tablet", views: 2100 }
        ],
        country: [
            { name: "US", views: 9800 },
            { name: "IN", views: 5600 },
            { name: "GB", views: 3200 },
            { name: "CA", views: 2100 },
            { name: "AU", views: 1800 }
        ]
    };

    const tabs = [
        { id: "browser", label: "Browser" },
        { id: "os", label: "OS" },
        { id: "device", label: "Device" },
        { id: "country", label: "Country" }
    ];

    return (
        <div className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col gap-2">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-none w-full border-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-none transition-colors ${activeTab === tab.id
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <StatList
                title={`Top ${tabs.find(t => t.id === activeTab)?.label}s`}
                type={activeTab}
                data={mockData[activeTab] || []}
            />
        </div>
    );
};

const FancyCard = () => {
    const [countries, setCountries] = useState([
        { code: "us", name: "United States", trend: "up", value: "12.5K" },
        { code: "in", name: "India", trend: "up", value: "8.2K" },
        { code: "gb", name: "United Kingdom", trend: "down", value: "5.1K" },
        { code: "ca", name: "Canada", trend: "up", value: "3.9K" },
        { code: "de", name: "Germany", trend: "down", value: "3.2K" },
        { code: "au", name: "Australia", trend: "up", value: "2.8K" },
        { code: "jp", name: "Japan", trend: "up", value: "2.1K" }
    ]);
    const [offset, setOffset] = useState(0);
    const [transition, setTransition] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTransition(false);
            setCountries(prev => {
                const arr = [...prev];
                arr.unshift(arr.pop());
                return arr;
            });
            setOffset(-48);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTransition(true);
                    setOffset(0);
                });
            });
        }, 2500);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 bg-card border p-4 flex flex-col gap-2 overflow-hidden">
            <h2 className="text-sm font-semibold uppercase tracking-tight text-foreground">
                Blazingly fast
            </h2>

            <GlobePreview />

            <div className="flex-1 relative overflow-hidden min-h-[192px]">
                <div
                    className="absolute inset-0 flex flex-col gap-2"
                    style={{
                        transform: `translateY(${offset}px)`,
                        transition: transition ? "transform 500ms ease-in-out" : "none"
                    }}
                >
                    {countries.map((country) => (
                        <div key={country.code} className="flex items-center justify-between p-2 h-[40px] bg-muted/30 border border-border/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <img src={`https://flagcdn.com/24x18/${country.code}.png`} alt={country.name} className="w-[18px] h-[13.5px] object-cover shadow-sm" />
                                <span className="text-sm font-medium">{country.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground">{country.value}</span>
                                {country.trend === "up" ? (
                                    <ArrowUp className="w-4 h-4 text-green-500" />
                                ) : (
                                    <ArrowDown className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function Features() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <h1 className="text-center font-bold text-2xl md:text-3xl tracking-tighter mb-20">
                Detailed <span className="text-muted-foreground">Analytics</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 md:gap-6">
                <VisitorTrendsCard />

                <FancyCard />

                <DemographicsCard />

                <WorldMapCard />
            </div>
        </div>
    );
}