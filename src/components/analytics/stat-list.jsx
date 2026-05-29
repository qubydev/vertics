"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatList({ title, data, metricLabel = "Visitors" }) {
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.views || 0)) : 1;

    return (
        <Card className="w-full flex flex-col h-[400px] rounded-xl shadow-none overflow-hidden">
            <CardHeader className="pt-4 px-6 pb-0! space-y-0 border-b border-border shrink-0">
                <div className="flex justify-between items-end w-full">
                    <div className="flex items-center">
                        <div className="pb-3 text-sm font-medium border-b-2 border-foreground text-foreground -mb-px">
                            {title}
                        </div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">{metricLabel}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-0 overflow-y-auto">
                {data.length > 0 ? (
                    <div className="flex flex-col w-full h-full p-2">
                        {data.map((item, i) => {
                            const pct = Math.min(100, Math.max(0, ((item.views || 0) / maxVal) * 100));
                            return (
                                <div key={i} className="group relative flex items-center justify-between gap-4 rounded-md px-4 py-2 hover:bg-muted/50 transition-colors">
                                    <div
                                        className="absolute left-1 top-1 bottom-1 bg-muted rounded-md transition-all -z-10"
                                        style={{ width: `calc(${pct}% - 8px)`, opacity: 0.7 }}
                                    />
                                    <div className="flex items-center gap-3 min-w-0 flex-1 z-10">
                                        <span className="truncate text-sm text-foreground font-medium">{item.name || "/"}</span>
                                    </div>
                                    <span className="text-sm font-medium text-foreground tabular-nums shrink-0 z-10">{item.views?.toLocaleString()}</span>
                                </div>
                            );
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