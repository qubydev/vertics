"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [router, session]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_40%),linear-gradient(180deg,_#f8fafc,_#ffffff)] px-6 text-slate-900">
        <p className="text-sm font-medium text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc,_#ffffff)] px-6 py-16 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col justify-between gap-16 rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.25)] backdrop-blur md:p-12">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Spantics</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">A clean starting point for your authenticated app.</h1>
          </div>
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
        </header>

        <section className="grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-slate-900" />
              Not authenticated users see this landing page.
            </div>
            <h2 className="mt-6 text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              Sign in once, then drop straight into the dashboard.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              The root route stays public, the dashboard stays protected, and the login page handles authentication without extra ceremony.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/login">
                  Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Flow</p>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-medium text-slate-900">1. Public landing</p>
                <p className="mt-1">Visitors see the marketing shell and login CTA.</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-medium text-slate-900">2. Authenticated dashboard</p>
                <p className="mt-1">Signed-in users get redirected to the dashboard automatically.</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="font-medium text-slate-900">3. Login page</p>
                <p className="mt-1">A single GitHub login button starts the auth flow.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
