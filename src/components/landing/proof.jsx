import { collections } from "@/db";

const formatCount = (value) => {
    const number = Number(value || 0);

    if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}m`;
    if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`;

    return number.toLocaleString();
};

async function getLandingStats() {
    try {
        const [sites, pageviews, visitors] = await Promise.all([
            collections.sites.countDocuments(),
            collections.analyticsEvents.countDocuments({ eventName: "pageview" }),
            collections.analyticsEvents.distinct("visitorId", { eventName: "pageview" }),
        ]);

        return {
            sites,
            pageviews,
            visitors: visitors.length,
        };
    } catch {
        return {
            sites: 0,
            pageviews: 0,
            visitors: 0,
        };
    }
}

export default async function Proof() {
    const stats = await getLandingStats();

    return (
        <div className="max-w-5xl w-full mx-auto flex items-center justify-center py-8 px-6">
            <div className="flex w-full items-center justify-between text-center max-w-3xl">
                <div className="px-2">
                    <p className="text-3xl md:text-5xl font-bold tracking-tighter leading-none">{formatCount(stats.sites)}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">websites tracked</p>
                </div>

                <div className="w-[1px] h-16 bg-border" />

                <div className="px-2">
                    <p className="text-3xl md:text-5xl font-bold tracking-tighter leading-none">{formatCount(stats.pageviews)}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">page views tracked</p>
                </div>

                <div className="w-[1px] h-16 bg-border" />

                <div className="px-2">
                    <p className="text-3xl md:text-5xl font-bold tracking-tighter leading-none">{formatCount(stats.visitors)}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-2">visitors measured</p>
                </div>
            </div>
        </div>
    );
}
