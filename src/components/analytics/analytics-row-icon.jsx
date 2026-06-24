"use client";

import Image from "next/image";
import { Globe } from "lucide-react";

const iconClassName = "w-4 h-4 shrink-0 object-contain";

const normalizeName = (name) => (name || "").toString().trim().toLowerCase();

const getBrowserIconName = (name) => {
    const normalized = normalizeName(name);
    const knownBrowsers = ["chrome", "edge", "firefox", "opera", "safari"];

    return knownBrowsers.includes(normalized) ? normalized : "default";
};

const getDeviceIconName = (name) => {
    const normalized = normalizeName(name);

    if (normalized === "mobile") return "phone";
    if (normalized === "tablet") return "tablet";
    if (normalized === "desktop") return "desktop";

    return "desktop";
};

const getOsIconName = (name) => {
    const normalized = normalizeName(name);

    if (normalized === "ios") return "iphone";

    const knownOperatingSystems = ["android", "iphone", "linux", "mac", "windows"];
    return knownOperatingSystems.includes(normalized) ? normalized : "default";
};

export function AnalyticsRowIcon({ type, name }) {
    if (type === "browser") {
        const iconName = getBrowserIconName(name);
        return <Image src={`/browser/${iconName}.png`} alt={name || "Browser"} width={16} height={16} className={iconClassName} />;
    }

    if (type === "device") {
        const iconName = getDeviceIconName(name);
        return <Image src={`/device/${iconName}.png`} alt={name || "Device"} width={16} height={16} className={iconClassName} />;
    }

    if (type === "os") {
        const iconName = getOsIconName(name);
        return <Image src={`/os/${iconName}.png`} alt={name || "Operating system"} width={16} height={16} className={iconClassName} />;
    }

    return <Globe className="w-4 h-4 text-muted-foreground shrink-0" />;
}
