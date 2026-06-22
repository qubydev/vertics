import React from 'react';

export default function Features() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <h1 className="text-center font-bold text-2xl md:text-3xl tracking-tighter mb-20">
                Detailed <span className="text-muted-foreground">Analytics</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 md:gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-6 bg-card border p-4 flex flex-col md:flex-row items-start gap-4">
                    <div className="flex-1">
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Visitor Trends</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Visualize traffic growth with detailed charts and historical visitor data.
                        </p>
                    </div>

                    <img
                        src="/logo.png"
                        alt="Visitor Trends"
                        className="w-full md:w-1/2 flex-1 aspect-square object-contain"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 bg-card border p-4 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Global Audience</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Explore visitors across the world with an interactive geographic overview.
                        </p>
                    </div>

                    <img
                        src="/logo.png"
                        alt="Global Audience"
                        className="w-full flex-1 aspect-square object-contain"
                    />

                    <div className='bg-secondary flex-1'></div>
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-4 flex flex-col gap-4">
                    <div className='flex-1'>
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Traffic Breakdown</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Analyze visitors by country, browser, operating system, and device.
                        </p>
                    </div>

                    <img
                        src="/logo.png"
                        alt="Traffic Breakdown"
                        className="w-full flex-1 aspect-square object-contain"
                    />
                </div>

                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-4 flex flex-col gap-4">
                    <div className='flex-1'>
                        <h2 className="text-lg md:text-xl font-semibold mb-2">Live Activity</h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Monitor active visitors and incoming events in real time.
                        </p>
                    </div>

                    <img
                        src="/logo.png"
                        alt="Live Activity"
                        className="w-full flex-1 aspect-square object-contain"
                    />
                </div>
            </div>
        </div>
    );
}