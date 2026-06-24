"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SiteLogo from "@/components/site-logo";
import { Skeleton } from "../ui/skeleton";
import ConnectButton from "@/components/connect-button";

export function DashboardHeader({ site, timeRange, setTimeRange, activeVisitors = 0 }) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard")}
                    className="shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-4">
                    <SiteLogo size={40} domain={site?.domain} />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold uppercase tracking-tight leading-none text-foreground">
                            {site?.name || (
                                <Skeleton className="w-32 h-5 rounded-none" />
                            )}
                        </h1>
                        {site?.domain ? (
                            <a
                                href={`https://${site.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm leading-none text-muted-foreground hover:text-foreground hover:underline w-fit"
                            >
                                {site.domain}
                            </a>
                        ) : (
                            <Skeleton className="w-48 h-4 rounded-none mt-1" />
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-auto grid grid-cols-[auto_auto_1fr] sm:flex items-center gap-2">
                <div className="flex h-9 items-center gap-2 border border-border bg-card px-3 text-sm font-bold uppercase tracking-tight text-foreground shrink-0">
                    <span className="size-2 bg-emerald-500" />
                    <span>{activeVisitors.toLocaleString()}</span>
                    <span className="hidden sm:inline">online</span>
                </div>
                <ConnectButton />
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-40 bg-card">
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
        </div>
    );
}
