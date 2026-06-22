'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Integration() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const snippet = '<script defer src="https://vertics.vercel.app/vertics.js" data-token="YOUR_SITE_TOKEN"></script>';
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-16">
            <h1 className="text-center text-muted-foreground font-bold text-2xl md:text-3xl tracking-tight underline decoration-dashed decoration-2 underline-offset-8 mb-20">
                Easy <span className="text-primary">Integration</span>
            </h1>

            <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="w-full border bg-muted">
                        <Image
                            src="/add-website.png"
                            alt="Add your website"
                            width={800}
                            height={600}
                            className="w-full h-auto aspect-[4/3] object-contain"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground text-base">1</span>
                            Add your website
                        </h2>
                        <div className="leading-relaxed text-muted-foreground">
                            <p>Add your website domain to vertices in your dashboard.</p>

                            <p className="mt-2">
                                Supported formats:
                            </p>

                            <ul className="mt-1 list-disc pl-5">
                                <li>yourdomain.com</li>
                                <li>www.yourdomain.com</li>
                                <li>https://yourdomain.com</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="w-full border bg-muted md:order-last">
                        <Image
                            src="/copy-token.png"
                            alt="Copy Your Token"
                            width={800}
                            height={600}
                            className="w-full h-auto aspect-[4/3] object-contain"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground text-base">2</span>
                            Copy Your Token
                        </h2>
                        <div className="text-muted-foreground leading-relaxed">
                            <p>Grab the unique tracking token for your web site from the dashboard.</p>
                            <p className='mt-2'>
                                <span className='font-bold'>Note:</span> This token is anonymous and safe to expose in frontend code.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="w-full border bg-muted">
                        <Image
                            src="/add-script.png"
                            alt="Install the Script"
                            width={800}
                            height={600}
                            className="w-full h-auto aspect-[4/3] object-contain"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground text-base">3</span>
                            Install the Script
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Paste this snippet into your website's &lt;head&gt; section, replacing <span className='font-bold'>YOUR_SITE_TOKEN</span> with your copied token.
                        </p>

                        <div className="mt-2 relative border border-border flex flex-col">
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
                                    <span className="text-emerald-300">"https://vertics.vercel.app/vertics.js"</span>
                                    <span className="text-sky-300"> data-token</span>
                                    <span className="text-zinc-500">=</span>
                                    <span className="text-amber-400 font-bold">"YOUR_SITE_TOKEN"</span>
                                    <span className="text-zinc-500">{"></"}</span>
                                    <span className="text-pink-400">script</span>
                                    <span className="text-zinc-500">{">"}</span>
                                </pre>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}