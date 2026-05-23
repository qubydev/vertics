"use client";

import { useEffect } from "react";
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
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button
        onClick={async () => {
          await authClient.signOut();
          router.replace("/");
        }}
      >
        Sign out
      </Button>
    </main>
  );
}