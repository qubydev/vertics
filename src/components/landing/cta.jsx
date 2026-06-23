"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const AsciiBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const activeChars = "01abc+=-/\\%#_.;:<>?*";

        let mouse = { x: -1000, y: -1000 };

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse = { x: -1000, y: -1000 };
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        const fontSize = 16;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const textColor = getComputedStyle(canvas).color;
            ctx.fillStyle = textColor;
            ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
            ctx.textBaseline = "top";

            const radius = 250;

            const columns = Math.ceil(canvas.width / fontSize);
            const rows = Math.ceil(canvas.height / fontSize);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    const posX = x * fontSize;
                    const posY = y * fontSize;

                    const dist = Math.hypot(posX - mouse.x, posY - mouse.y);

                    if (dist < radius) {
                        const alpha = Math.max(0, 1 - (dist / radius));

                        ctx.globalAlpha = alpha * alpha;

                        const char = activeChars[Math.floor(Math.random() * activeChars.length)];
                        ctx.fillText(char, posX, posY);
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full text-background pointer-events-auto"
        />
    );
};

export default function CTA() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20 group">
            <div className="relative border border-background/20 bg-foreground text-background p-10 md:p-16 text-center flex flex-col items-center overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <AsciiBackground />
                </div>

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