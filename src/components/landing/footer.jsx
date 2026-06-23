import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full relative overflow-hidden bg-background pt-16 md:pt-24 mt-10">
            <div className="max-w-5xl mx-auto px-4 flex flex-col gap-12 md:flex-row md:justify-between relative z-10">
                <div className="flex flex-col items-start gap-4">
                    <img
                        src="/logo.png"
                        alt="Vertics Logo"
                        className="h-8 w-auto object-contain"
                    />
                    <p className="text-sm text-muted-foreground max-w-xs font-medium">
                        Lightweight web analytics. Track visitors and live activity with a single script.
                    </p>
                    <p className="text-xs text-muted-foreground/50 font-medium mt-2">
                        © 2026 Vertics. All rights reserved.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold uppercase tracking-tight text-foreground">Product</span>
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Home</Link>
                        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Dashboard</Link>
                        <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</Link>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold uppercase tracking-tight text-foreground">Resources</span>
                        <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Documentation</Link>
                        <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Blog</Link>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold uppercase tracking-tight text-foreground">Legal</span>
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Privacy</Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Terms</Link>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center mt-12 md:mt-16 pointer-events-none select-none relative z-0">
                <h1 className="text-[28vw] md:text-[280px] leading-[0.8] font-bold tracking-tighter uppercase translate-y-[25%] opacity-40 bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent">
                    VERTICS
                </h1>
            </div>
        </footer>
    );
}