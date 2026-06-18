"use client";

import Link from "next/link";
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
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className="py-4 px-4 sm:px-6 h-18 flex items-center max-w-5xl w-full border-2 bg-card">
            <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Vertics Logo" className="size-8 hidden sm:block" />
                <span className="font-bold text-2xl tracking-tight text-foreground uppercase">Vertics</span>
            </Link>

            <div className="flex-1"></div>

            {!pathname.startsWith("/dashboard") ? (
                <Button
                    onClick={() => router.push(session ? "/dashboard" : "/login")}
                >
                    {session ? "Dashboard" : "Login"}
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none cursor-pointer">
                        <Avatar className="border size-9">
                            <AvatarFallback className="font-bold text-lg">
                                {session?.user?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                            <AvatarImage src={session?.user?.image} />
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-100">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-foreground font-medium leading-none">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Button
                            className="w-full"
                            variant="destructive"
                            onClick={() => authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        router.push("/login");
                                    },
                                },
                            })}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </nav>
    );
}