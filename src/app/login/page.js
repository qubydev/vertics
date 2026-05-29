"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { FaGithub } from "react-icons/fa";

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
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 relative selection:bg-primary/20">

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <img src="/logo.png" alt="Vertics Logo" className="h-8 w-auto" />
          <span className="font-bold text-2xl tracking-tight text-foreground">Vertics</span>
        </Link>

        <div className="w-full rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col p-8 space-y-2 text-center border-b border-border/50">
            <h1 className="font-semibold tracking-tight text-2xl text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <div className="p-8 bg-muted/10">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 text-base font-medium relative"
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
              {isSigningIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <FaGithub className="mr-2 h-5 w-5" />
              )}
              {isSigningIn ? "Connecting..." : "Continue with GitHub"}
            </Button>
          </div>
        </div>

        <p className="mt-10 px-8 text-center text-sm text-muted-foreground leading-relaxed">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">Terms of Service</Link>
          {" "}and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}