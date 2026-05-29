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

export default function Navbar() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    if (isPending || !session) {
        return (
            <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Vertics Logo" className="h-8 w-auto" />
                        <span className="font-bold text-xl tracking-tight text-foreground">Vertics</span>
                    </Link>
                </div>
            </nav>
        );
    }

    const userInitials = session?.user?.name
        ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Vertics Logo" className="h-8 w-auto" />
                    <span className="font-bold text-xl tracking-tight text-foreground">Vertics</span>
                </Link>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={session.user.image} alt={session.user.name} />
                                <AvatarFallback className="bg-muted text-foreground font-medium text-sm">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-md border-border">
                            <DropdownMenuLabel className="font-normal p-3">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-semibold leading-none text-foreground">{session.user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">{session.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer m-1 p-2.5 rounded-md"
                                onClick={async () => {
                                    await authClient.signOut();
                                    router.replace("/");
                                }}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}