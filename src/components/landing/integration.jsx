import React from 'react';

export default function Integration() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4">
            <div className="mb-16">
                <h1 className="text-center text-muted-foreground font-bold text-xl md:text-2xl tracking-tight underline decoration-dashed decoration-2 underline-offset-8">
                    Easy <span className="text-primary">Integration</span>
                </h1>
            </div>

            <div className="flex flex-col gap-16 md:gap-24">
                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img src="/add-website.png" alt="Add your website" className="w-full max-w-82 aspect-square object-contain bg-muted border" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-4 md:pt-4">
                        <h2 className="text-2xl font-bold flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm">1</span>
                            Add your website
                        </h2>
                        <p className="text-muted-foreground max-w-94">
                            Add your website domain to vertices in your dashboard.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-start gap-8 md:gap-12">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img src="/copy-token.png" alt="Copy Your Token" className="w-full max-w-82 aspect-square object-contain bg-muted border" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-4 md:pt-4">
                        <h2 className="text-2xl font-bold flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm">2</span>
                            Copy Your Token
                        </h2>
                        <p className="text-muted-foreground max-w-94">
                            Grab the unique tracking token for your web site from the dashboard.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img src="/add-script.png" alt="Install the Script" className="w-full max-w-82 aspect-square object-contain bg-muted border" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-4 md:pt-4">
                        <h2 className="text-2xl font-bold flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground text-sm">3</span>
                            Install the Script
                        </h2>
                        <p className="text-muted-foreground max-w-94">
                            Paste this snippet into your website's &lt;head&gt; section, replacing YOUR_SITE_TOKEN with your copied token.
                        </p>
                        <div className="mt-2 w-full border max-w-94">
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