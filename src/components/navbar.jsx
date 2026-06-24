"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import ConnectButton from "./connect-button";
import { Skeleton } from "./ui/skeleton";
import { useTheme } from "./theme-provider";

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { resolvedTheme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const isAppRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

    const handleSignOut = async () => {
        if (isSigningOut) return;

        setIsSigningOut(true);

        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.replace("/login");
                    router.refresh();
                },
                onError: () => {
                    setIsSigningOut(false);
                },
            },
        });
    };

    return (
        <nav className="py-4 px-4 sm:px-6 h-18 flex items-center w-full border-2 bg-card gap-3 mx-auto">
            <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Vertics Logo" className="size-8" />
                <span className="font-bold text-2xl tracking-tight text-foreground uppercase hidden sm:block">Vertics</span>
            </Link>

            <div className="flex-1"></div>

            {pathname.startsWith("/dashboard") && (
                <ConnectButton />
            )}

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
                title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
            >
                {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
            </Button>

            {!isAppRoute ? (
                <Button
                    onClick={() => router.push(session ? "/dashboard" : "/login")}
                >
                    {session ? "Dashboard" : "Login"}
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none cursor-pointer">
                        <Avatar className="size-9">
                            <AvatarFallback className="font-bold text-lg">
                                {session?.user?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                            <AvatarImage src={session?.user?.image} />
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-100 mt-2.5">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                {session?.user ? (
                                    <>
                                        <p className="text-foreground font-medium leading-none">{session?.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-4 w-50" />
                                    </>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Button
                            className="w-full"
                            variant="destructive"
                            disabled={isSigningOut}
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{isSigningOut ? "Logging out..." : "Log out"}</span>
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </nav>
    );
}
