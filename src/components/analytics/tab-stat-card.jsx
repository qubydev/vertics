"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet, Globe } from "lucide-react";

export function TabStatCard({ leftTitle, rightTitle, leftData, rightData, leftType = "default", rightType = "default" }) {
    const [active, setActive] = useState("left");

    const data = active === "left" ? leftData : rightData;
    const currentType = active === "left" ? leftType : rightType;
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.views || 0)) : 1;

    const getIcon = (type, name) => {
        if (type === "device") {
            if (name?.toLowerCase() === "mobile") return <Smartphone className="w-4 h-4 text-muted-foreground shrink-0" />;
            if (name?.toLowerCase() === "tablet") return <Tablet className="w-4 h-4 text-muted-foreground shrink-0" />;
            return <Monitor className="w-4 h-4 text-muted-foreground shrink-0" />;
        }
        if (type === "browser") {
            return <Globe className="w-4 h-4 text-muted-foreground shrink-0" />;
        }
        return null;
    };

    return (
        <Card className="w-full flex flex-col h-[400px] rounded-xl shadow-none overflow-hidden">
            <CardHeader className="pt-4 px-6 pb-0! space-y-0 border-b border-border shrink-0">
                <div className="flex justify-between items-end w-full">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActive("left")}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${active === "left"
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground/80"
                                }`}
                        >
                            {leftTitle}
                        </button>
                        <button
                            onClick={() => setActive("right")}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${active === "right"
                                    ? "border-foreground text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground/80"
                                }`}
                        >
                            {rightTitle}
                        </button>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">Visitors</span>
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
                                        {getIcon(currentType, item.name)}
                                        <span className="truncate text-sm text-foreground font-medium">{item.name || "Unknown"}</span>
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