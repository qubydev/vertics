'use client';

import React, { useState } from 'react';
import { Check, Copy, Edit, Globe, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function CursorPointer({ ...props }) {
    return (
        <svg
            width={48}
            height={48}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#a)">
                <path
                    d="M39.745 42.65c1.384.6 2.076.9 2.488.764a1.14 1.14 0 0 0 .738-.765c.12-.417-.205-1.098-.856-2.459L25.512 5.477c-.532-1.113-.799-1.67-1.16-1.844a1.14 1.14 0 0 0-.996.006c-.361.177-.621.737-1.142 1.856L5.985 40.385c-.636 1.367-.954 2.052-.829 2.467.108.36.387.643.746.758.413.131 1.102-.177 2.48-.791l14.912-6.658c.27-.12.404-.18.545-.204q.187-.033.376-.002c.14.022.276.081.547.199z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h48v48H0z" />
                </clipPath>
            </defs>
        </svg>
    );
}

function AddWebsitePreview() {
    return (
        <div className="relative w-full px-4 py-8 sm:px-8 md:px-6 lg:px-10">
            <div className="mx-auto w-full max-w-md border border-border bg-background p-5 shadow-xs sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
                            Add New Website
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter the details for your new website below.
                        </p>
                    </div>
                    <span className="text-xl leading-none text-muted-foreground" aria-hidden="true">
                        ×
                    </span>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="preview-name">Website Name</Label>
                        <Input
                            id="preview-name"
                            value="My Website"
                            readOnly
                            tabIndex={-1}
                            aria-label="Website Name preview"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="preview-domain">Domain</Label>
                        <Input
                            id="preview-domain"
                            value="https://mywebsite.com"
                            readOnly
                            tabIndex={-1}
                            aria-label="Domain preview"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end relative">
                    <Button tabIndex={-1} aria-label="Save Website preview">
                        Save Website
                    </Button>
                    <CursorPointer className="absolute bottom-0 right-0 size-8 rotate-[-45deg] translate-x-[50%] translate-y-[50%]" />
                </div>
            </div>
        </div>
    );
}

function CopyTokenPreview() {
    return (
        <div className="relative w-full px-4 py-8 sm:px-8 md:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-md flex-col gap-6">
                <div className="flex items-center justify-end gap-3">
                    <div className="relative min-w-0 flex-1 sm:max-w-64">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            value=""
                            readOnly
                            tabIndex={-1}
                            placeholder="Search..."
                            className="pl-8"
                            aria-label="Search preview"
                        />
                    </div>
                    <Button tabIndex={-1} aria-label="Add New preview">
                        <Plus className="size-4" />
                        Add New
                    </Button>
                </div>

                <div className="border border-border bg-card p-5 shadow-xs sm:p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground">
                            <Globe className="size-6" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-bold uppercase leading-none tracking-tight text-card-foreground">
                                My Website
                            </h3>
                            <p className="mt-2 truncate text-sm text-muted-foreground">
                                mywebsite.com
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4">
                        <div className="relative">
                            <Button variant="ghost" tabIndex={-1} aria-label="Copy Token preview">
                                <Copy className="size-4" />
                                Copy Token
                            </Button>
                            <CursorPointer className="absolute bottom-0 left-0 size-8 rotate-[40deg] translate-x-[-20%] translate-y-[20%]" />
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" tabIndex={-1} aria-label="Edit preview">
                                <Edit className="size-4" />
                            </Button>
                            <Button variant="destructive" size="icon" tabIndex={-1} aria-label="Delete preview">
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InstallScriptPreview() {
    return (
        <div className="w-full px-4 py-8 sm:px-8 md:px-6 lg:px-10">
            <pre className="mx-auto w-full max-w-md select-none whitespace-pre-wrap break-words text-sm leading-7 text-foreground">
                <code>
                    <span className="text-red-700 dark:text-red-400">&lt;head&gt;</span>
                    {'\n'}
                    <span className="text-border">│</span>
                    {'  '}
                    <span className="text-red-700 dark:text-red-400">&lt;meta</span>
                    {' '}
                    <span className="text-red-600 dark:text-red-300">charset</span>
                    <span className="text-foreground">=</span>
                    <span className="text-blue-700 dark:text-blue-300">&quot;UTF-8&quot;</span>
                    <span className="text-red-700 dark:text-red-400">&gt;</span>
                    {'\n'}
                    <span className="text-border">│</span>
                    {'  '}
                    <span className="text-red-700 dark:text-red-400">&lt;meta</span>
                    {' '}
                    <span className="text-red-600 dark:text-red-300">name</span>
                    <span className="text-foreground">=</span>
                    <span className="text-blue-700 dark:text-blue-300">&quot;viewport&quot;</span>
                    {' '}
                    <span className="text-red-600 dark:text-red-300">content</span>
                    <span className="text-foreground">=</span>
                    <span className="text-blue-700 dark:text-blue-300">&quot;width=device-width, initial-scale=1&quot;</span>
                    <span className="text-red-700 dark:text-red-400">&gt;</span>
                    {'\n'}
                    <span className="text-border">│</span>
                    {'  '}
                    <span className="text-red-700 dark:text-red-400">&lt;title&gt;</span>
                    <span>Vertics Demo</span>
                    <span className="text-red-700 dark:text-red-400">&lt;/title&gt;</span>
                    {'\n'}
                    <span className="inline-block rounded-sm bg-emerald-200/80 px-2 text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-100">
                        <span className="text-red-700 dark:text-red-300">&lt;script</span>
                        {' '}
                        <span className="text-teal-700 dark:text-teal-300">defer</span>
                        {' '}
                        <span className="text-teal-700 dark:text-teal-300">src</span>
                        <span>=</span>
                        <span className="text-blue-700 dark:text-blue-300">&quot;https://vertics.vercel.app/vertics.min.js&quot;</span>
                    </span>
                    {'\n'}
                    <span className="inline-block rounded-sm bg-emerald-200/80 px-2 text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-100">
                        <span className="text-teal-700 dark:text-teal-300">data-token</span>
                        <span>=</span>
                        <span className="text-blue-700 dark:text-blue-300">&quot;36efa76e-834b-4b03-9a47-537d94cc1338&quot;</span>
                        <span className="text-red-700 dark:text-red-300">&gt;</span>
                    </span>
                    {'\n'}
                    <span className="text-border">│</span>
                    {'  '}
                    <span className="text-red-700 dark:text-red-400">&lt;/script&gt;</span>
                    {'\n'}
                    <span className="text-red-700 dark:text-red-400">&lt;/head&gt;</span>
                </code>
            </pre>
        </div>
    );
}

export default function Integration() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const snippet = '<script defer src="https://vertics.vercel.app/vertics.min.js" data-token="YOUR_SITE_TOKEN"></script>';
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <h1 className="text-center font-bold text-2xl md:text-3xl tracking-tighter mb-20">
                Easy <span className="text-muted-foreground">Integration</span>
            </h1>

            <div className="flex flex-col gap-10 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <AddWebsitePreview />

                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground text-sm">
                                1
                            </span>
                            Add your website
                        </h2>

                        <div className="text-sm md:text-base text-muted-foreground">
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
                    <div className="md:order-last">
                        <CopyTokenPreview />
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground text-sm">
                                2
                            </span>
                            Copy Your Token
                        </h2>

                        <div className="text-sm md:text-base text-muted-foreground">
                            <p>Grab the unique tracking token for your web site from the dashboard.</p>

                            <p className="mt-2">
                                <span className="font-semibold text-foreground">Note:</span> This token is anonymous and safe to expose in frontend code.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <InstallScriptPreview />

                    <div className="flex flex-col gap-3">
                        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
                            <span className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground text-sm">
                                3
                            </span>
                            Install the Script
                        </h2>

                        <p className="text-sm md:text-base text-muted-foreground">
                            Paste this snippet into your website&apos;s &lt;head&gt; section, replacing <span className="font-semibold text-foreground">YOUR_SITE_TOKEN</span> with your copied token.
                        </p>

                        <div className="mt-2 relative border border-border flex flex-col">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
                                <span className="text-xs font-semibold uppercase text-muted-foreground">
                                    HTML
                                </span>

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
                                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
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
            </div>
        </div>
    );
}
