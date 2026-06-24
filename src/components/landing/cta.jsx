"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useEffect } from "react";

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const randomString = (length) => {
    return Array.from({ length })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
};

export default function CTA() {
    const containerRef = useRef(null);
    const lettersRef = useRef(null);

    useEffect(() => {
        if (lettersRef.current) {
            lettersRef.current.innerText = randomString(20000);
        }
    }, []);

    const handleMouseMove = (e) => {
        if (!containerRef.current || !lettersRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        lettersRef.current.style.setProperty("--x", `${x}px`);
        lettersRef.current.style.setProperty("--y", `${y}px`);
        lettersRef.current.innerText = randomString(20000);
    };

    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20 group">
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative border border-border bg-card text-card-foreground p-10 md:p-16 text-center flex flex-col items-center overflow-hidden"
            >
                <div
                    ref={lettersRef}
                    className="absolute inset-0 z-0 overflow-hidden break-all font-mono text-[0.8rem] font-medium leading-none text-foreground/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none select-none"
                    style={{
                        WebkitMaskImage: `radial-gradient(350px circle at var(--x, 0px) var(--y, 0px), white 20%, rgb(255 255 255 / 25%), transparent)`,
                        maskImage: `radial-gradient(350px circle at var(--x, 0px) var(--y, 0px), white 20%, rgb(255 255 255 / 25%), transparent)`
                    }}
                />

                <div className="relative z-10 flex flex-col items-center pointer-events-none">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        Start Tracking Today
                    </h1>

                    <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg">
                        Drop a single script into your app and instantly unlock real-time visitor insights.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 pointer-events-auto">
                        <Button asChild size="lg">
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
