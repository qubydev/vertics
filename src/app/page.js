"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
      <main className="flex min-h-screen items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </main>
  );
}