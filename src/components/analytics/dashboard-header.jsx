"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DashboardHeader({ site, timeRange, setTimeRange }) {
    const router = useRouter();

    return (
        <div className="flex w-full items-center justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard")}
                    className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <h1 className="text-base font-semibold text-foreground">
                        {site?.name || site?.domain || "Loading..."}
                    </h1>
                </div>
            </div>

            <div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40 h-9 bg-card border-border text-sm font-medium text-foreground shadow-none focus:ring-0">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-md border-border">
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="3mo">Last 3 months</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}