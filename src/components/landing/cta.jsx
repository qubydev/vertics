"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export default function CTA() {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        const chunkSize = 15;
        const x = Math.round(rawX / chunkSize) * chunkSize;
        const y = Math.round(rawY / chunkSize) * chunkSize;

        setMousePos({ x, y });
    };

    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20 group">
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative border border-background/20 bg-foreground text-background p-10 md:p-16 text-center flex flex-col items-center overflow-hidden"
            >
                {/* Pixelated Hover Gradient */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out"
                    style={{
                        opacity: isHovering ? 1 : 0,
                        // Fixed using native color-mix to add transparency to your oklch variable
                        background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in oklab, var(--background) 30%, transparent), transparent 70%)`,
                        maskImage: `
                            repeating-linear-gradient(to right, black 0, black 10px, transparent 10px, transparent 12px),
                            repeating-linear-gradient(to bottom, black 0, black 10px, transparent 10px, transparent 12px)
                        `,
                        WebkitMaskImage: `
                            repeating-linear-gradient(to right, black 0, black 10px, transparent 10px, transparent 12px),
                            repeating-linear-gradient(to bottom, black 0, black 10px, transparent 10px, transparent 12px)
                        `,
                        WebkitMaskComposite: 'source-in',
                        maskComposite: 'intersect',
                    }}
                />

                <div className="relative z-10 flex flex-col items-center pointer-events-none">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        Start Tracking Today
                    </h1>

                    <p className="mt-4 text-sm md:text-base text-background/80 max-w-lg">
                        Drop a single script into your app and instantly unlock real-time visitor insights.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 pointer-events-auto">
                        <Button size="lg" variant="secondary">
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}