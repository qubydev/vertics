"use client";

import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Plug, Copy, Check } from 'lucide-react';
import { Button } from "./ui/button";

export default function ConnectButton() {
    const [copied, setCopied] = useState(false);

    const scriptCode = `<script defer src="https://vertics.vercel.app/vertics.min.js" data-token="YOUR_SITE_TOKEN"></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="font-bold uppercase tracking-tight">
                    <Plug className="w-4 h-4" /> Connect
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col sm:max-w-md w-full">
                <SheetHeader className="text-left">
                    <SheetTitle className="text-lg font-bold uppercase tracking-tight">Connect Vertics</SheetTitle>
                    <SheetDescription className="text-sm pr-4">
                        Follow these steps to connect with your website.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-8 p-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                            <span className="flex items-center justify-center bg-foreground text-background w-5 h-5 text-xs">1</span>
                            Add your website
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Add your website domain to vertices in your dashboard.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                            <span className="flex items-center justify-center bg-foreground text-background w-5 h-5 text-xs">2</span>
                            Copy Your Token
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Grab the unique tracking token for your web site from the dashboard.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                            <span className="flex items-center justify-center bg-foreground text-background w-5 h-5 text-xs">3</span>
                            Install the Script
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            Paste this snippet into your website&apos;s <code className="bg-muted/50 px-1 py-0.5 text-foreground font-mono text-xs border border-border">{"<head>"}</code> section, replacing <code className="bg-muted/50 px-1 py-0.5 text-foreground font-mono text-xs font-medium border border-border">YOUR_SITE_TOKEN</code> with your copied token.
                        </p>

                        <div className="relative border border-border flex flex-col">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                                <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">HTML</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                </Button>
                            </div>
                            <div className="p-4 overflow-x-auto bg-zinc-950">
                                <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-all">
                                    <span className="text-zinc-500">{"<"}</span>
                                    <span className="text-pink-400">script</span>
                                    <span className="text-sky-300"> defer</span>
                                    <span className="text-sky-300"> src</span>
                                    <span className="text-zinc-500">=</span>
                                    <span className="text-emerald-300">{'"https://vertics.vercel.app/vertics.min.js"'}</span>
                                    <span className="text-sky-300"> data-token</span>
                                    <span className="text-zinc-500">=</span>
                                    <span className="text-amber-400 font-bold">{'"YOUR_SITE_TOKEN"'}</span>
                                    <span className="text-zinc-500">{"></"}</span>
                                    <span className="text-pink-400">script</span>
                                    <span className="text-zinc-500">{">"}</span>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
