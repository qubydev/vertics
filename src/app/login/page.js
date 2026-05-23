"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button
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
        {isSigningIn ? "Redirecting..." : "Continue with GitHub"}
      </Button>
    </main>
  );
}