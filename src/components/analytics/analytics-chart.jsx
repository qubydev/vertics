"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export function AnalyticsChart({ data, activeSeriesKey }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-bold uppercase tracking-tight">No data available for this period.</span>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-foreground)" stopOpacity={0.05} />
                        <stop offset="95%" stopColor="var(--color-foreground)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis
                    dataKey="date"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    minTickGap={40}
                />
                <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
                    contentStyle={{
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        padding: '8px 12px'
                    }}
                    itemStyle={{ color: 'var(--color-foreground)', fontWeight: 600, fontSize: '13px' }}
                    labelStyle={{ color: 'var(--color-muted-foreground)', fontSize: '11px', marginBottom: '4px' }}
                />
                <Area
                    type="monotone"
                    dataKey={activeSeriesKey}
                    stroke="var(--color-foreground)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMetric)"
                    activeDot={{ r: 4, fill: 'var(--color-foreground)', strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}