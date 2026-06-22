import Link from "next/link";

export default function Footer() {
    return (
        <footer className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <div className="border-t pt-8 md:pt-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Vertics</h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Lightweight web analytics for modern applications.
                        Track visitors, traffic, and live activity with a single script.
                    </p>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Home
                    </Link>

                    <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/pricing"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Pricing
                    </Link>

                    <Link
                        href="/docs"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Documentation
                    </Link>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
                <p>© 2025 Vertics. All rights reserved.</p>

                <div className="flex items-center gap-4">
                    <Link
                        href="/privacy"
                        className="hover:text-foreground transition-colors"
                    >
                        Privacy
                    </Link>

                    <Link
                        href="/terms"
                        className="hover:text-foreground transition-colors"
                    >
                        Terms
                    </Link>
                </div>
            </div>
        </footer>
    );
}