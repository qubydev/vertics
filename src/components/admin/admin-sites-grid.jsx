"use client";

import { useRouter } from "next/navigation";

import { SiteCard } from "@/components/dashboard/site-card";

export function AdminSitesGrid({ sites }) {
    const router = useRouter();

    if (!sites.length) {
        return (
            <p className="border-2 bg-card px-6 py-8 text-sm text-muted-foreground">
                No sites have been registered yet.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((trackedSite) => (
                <SiteCard
                    key={trackedSite.id}
                    site={trackedSite}
                    mode="view"
                    ownerLabel={trackedSite.ownerEmail || "Unknown"}
                    onOpen={() => router.push(`/admin/${trackedSite.id}`)}
                />
            ))}
        </div>
    );
}
