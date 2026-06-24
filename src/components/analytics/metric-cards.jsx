"use client";

export function MetricCards({ metricConfig, activeMetric, setActiveMetric }) {
    return (
        <div className="grid grid-cols-3 w-full border-b border-border bg-muted/10 overflow-hidden">
            {Object.entries(metricConfig).map(([key, config]) => {
                const trend = config.trend || 0;
                const isInverse = config.trendDirection === "inverse";
                const isPositive = trend > 0;
                const isNegative = trend < 0;
                const isGood = isInverse ? isNegative : isPositive;
                const trendClassName = isPositive || isNegative
                    ? isGood ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    : "text-muted-foreground";

                return (
                    <button
                        key={key}
                        onClick={() => setActiveMetric(key)}
                        className={`flex min-w-0 flex-col items-center gap-2 px-3 py-5 text-center transition-all border-r last:border-r-0 border-border relative ${activeMetric === key
                                ? "bg-card"
                                : "hover:bg-muted/40"
                            }`}
                    >
                        {activeMetric === key && (
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground" />
                        )}
                        <span className="w-full truncate text-xs font-bold text-muted-foreground uppercase tracking-tight">
                            {config.label}
                        </span>
                        <span className="text-3xl font-bold text-foreground tracking-tight">
                            {config.formatValue ? config.formatValue(config.value) : config.value.toLocaleString()}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-tight ${trendClassName}`}>
                            {trend > 0 ? "+" : ""}{trend}%
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
