"use client";

export function MetricCards({ metricConfig, activeMetric, setActiveMetric }) {
    return (
        <div className="flex w-full border-b border-border bg-muted/20">
            {Object.entries(metricConfig).map(([key, config]) => (
                <button
                    key={key}
                    onClick={() => setActiveMetric(key)}
                    className={`flex flex-col gap-1 px-8 py-4 text-left transition-all border-r border-border relative min-w-[180px] ${activeMetric === key
                            ? "bg-card"
                            : "hover:bg-muted/40"
                        }`}
                >
                    {activeMetric === key && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {config.label}
                    </span>
                    <span className="text-2xl font-bold text-foreground tracking-tight">
                        {config.value.toLocaleString()}
                    </span>
                </button>
            ))}
        </div>
    );
}