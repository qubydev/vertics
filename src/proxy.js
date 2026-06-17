import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request) {
    const sessionCookie = getSessionCookie(request);
    const pathname = request.nextUrl.pathname;

    const protectedRoutes = ["/dashboard"];

    if (sessionCookie && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!sessionCookie && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard"],
};