"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <p className="text-sm font-medium text-slate-400">Loading dashboard...</p>
      </main>
    );
  }

  const userName = session?.user?.name || session?.user?.email || "there";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur md:p-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back, {userName}.</h1>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-white/15 bg-transparent text-slate-100 hover:bg-white/10 hover:text-slate-100">
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                await authClient.signOut();
                router.replace("/");
                router.refresh();
              }}
            >
              Sign out
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Session</p>
            <p className="mt-2 text-xl font-semibold">Active</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">User</p>
            <p className="mt-2 text-xl font-semibold">{userName}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <p className="text-sm text-slate-400">Route</p>
            <p className="mt-2 text-xl font-semibold">/dashboard</p>
          </div>
        </section>
      </div>
    </main>
  );
}