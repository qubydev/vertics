"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Mail } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    const [activeLetter, setActiveLetter] = useState(null);
    const brandLetters = "VERTICS".split("");

    return (
        <footer className="w-full relative overflow-hidden bg-background pt-16 md:pt-24 mt-10">
            <div className="max-w-5xl mx-auto px-4 flex flex-col gap-12 md:flex-row md:justify-between relative z-10">
                <div className="flex flex-col items-start gap-4">
                    <Image
                        src="/logo.png"
                        alt="Vertics Logo"
                        width={128}
                        height={32}
                        className="h-8 w-auto object-contain"
                    />
                    <p className="text-sm text-muted-foreground max-w-xs font-medium">
                        Lightweight web analytics. Track visitors and live activity with a single script.
                    </p>
                    <p className="text-xs text-muted-foreground/50 font-medium mt-2">
                        © 2026 Vertics. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <Link href="https://x.com/qubydev" target="_blank" rel="noopener noreferrer" aria-label="Vertics on X" className="flex size-8 items-center justify-center border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <FaXTwitter className="size-4" />
                        </Link>
                        <Link href="https://www.linkedin.com/in/qubydev" target="_blank" rel="noopener noreferrer" aria-label="Vertics on LinkedIn" className="flex size-8 items-center justify-center border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <FaLinkedinIn className="size-4" />
                        </Link>
                        <Link href="mailto:malay77patra@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email Vertics" className="flex size-8 items-center justify-center border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                            <Mail className="size-4" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold uppercase tracking-tight text-foreground">Product</span>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Home</Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Dashboard</Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</Link>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold uppercase tracking-tight text-foreground">Resources</span>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Documentation</Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Blog</Link>
                    </div>

                    <div className="flex flex-col gap-4 text-sm">
                        <span className="font-bold uppercase tracking-tight text-foreground">Legal</span>
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Privacy</Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Terms</Link>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center mt-12 md:mt-16 select-none relative z-0">
                <h1
                    className="whitespace-nowrap text-[23vw] md:text-[280px] leading-[0.8] font-bold tracking-tighter uppercase translate-y-[25%] opacity-40"
                    onMouseLeave={() => setActiveLetter(null)}
                    aria-label="VERTICS"
                >
                    {brandLetters.map((letter, index) => (
                        <span
                            key={`${letter}-${index}`}
                            className="inline-block cursor-default bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent transition-transform duration-300 ease-out will-change-transform"
                            style={{
                                transform: activeLetter === index ? "translateY(-0.2em)" : "translateY(0)",
                            }}
                            onMouseEnter={() => setActiveLetter(index)}
                            aria-hidden="true"
                        >
                            {letter}
                        </span>
                    ))}
                </h1>
            </div>
        </footer>
    );
}
