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
        <div className="flex w-full items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard")}
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted/30">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-base font-bold uppercase tracking-tight leading-none text-foreground">
                            {site?.name || site?.domain || "Loading..."}
                        </h1>
                        {site?.domain && (
                            <a
                                href={`https://${site.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm leading-none text-muted-foreground hover:text-foreground hover:underline w-fit"
                            >
                                {site.domain}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40 h-9 bg-card border-border text-sm font-medium text-foreground shadow-none focus:ring-0">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent className="border-border">
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