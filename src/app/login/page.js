"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [router, session]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <p className="text-sm font-medium text-slate-400">Loading login...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,#0f172a,#020617)] px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Login</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to continue.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Use your GitHub account to authenticate and land on the dashboard.
        </p>

        <Button
          className="mt-8 w-full gap-2"
          size="lg"
          onClick={async () => {
            setIsSigningIn(true);
            try {
              const response = await authClient.signIn.social({
                provider: "github",
                callbackURL: "/dashboard",
              });

              if (response?.url) {
                window.location.href = response.url;
              }
            } finally {
              setIsSigningIn(false);
            }
          }}
          disabled={isSigningIn}
        >
          <LogIn className="h-4 w-4" />
          {isSigningIn ? "Redirecting..." : "Continue with GitHub"}
        </Button>
      </div>
    </main>
  );
}