import "server-only";

import { auth } from "@/auth";
import { headers } from "next/headers";

export function getAdminEmails() {
    return (process.env.ADMIN_EMAILS || "")
        .replaceAll("ADMIN_EMAILS=", ",")
        .split(/[\s,;]+/)
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

export function isAdminEmail(email) {
    if (!email) return false;
    return getAdminEmails().includes(email.toLowerCase());
}

export function isAdminSession(session) {
    return Boolean(session?.user?.role === "admin" || isAdminEmail(session?.user?.email));
}

export async function getAdminSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!isAdminSession(session)) {
        return null;
    }

    return session;
}
