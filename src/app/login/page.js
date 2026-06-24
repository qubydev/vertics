"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Navbar from "@/components/navbar";

export default function LoginPage() {
  const [signingInProvider, setSigningInProvider] = useState(null);

  const handleSocialSignIn = async (provider) => {
    setSigningInProvider(provider);

    const response = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });

    if (response?.url) {
      window.location.href = response.url;
      return;
    }

    setSigningInProvider(null);
  };

  return (
    <div className="min-h-screen pt-18 sm:pt-24">
      <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto">
        <div className="max-w-264 w-full sm:px-4 sm:pt-4">
          <Navbar />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 pt-[14vh]">
        <Card className="w-full max-w-[400px] flex flex-col">
          <CardHeader className="text-center pb-6 border-b border-border">
            <CardTitle className="text-2xl font-bold uppercase tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 bg-muted/10 space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full font-bold uppercase tracking-tight h-12"
              onClick={() => handleSocialSignIn("google")}
              disabled={!!signingInProvider}
            >
              {signingInProvider === "google" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <FaGoogle className="mr-2 h-4 w-4" />
                  Continue with Google
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full font-bold uppercase tracking-tight h-12"
              onClick={() => handleSocialSignIn("github")}
              disabled={!!signingInProvider}
            >
              {signingInProvider === "github" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <FaGithub className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
