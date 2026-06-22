import React from 'react';

export default function Features() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4">
            <h1 className="text-center text-muted-foreground font-bold text-xl md:text-2xl tracking-tight underline decoration-dashed decoration-2 underline-offset-8 mb-16">
                Detailed <span className="text-primary">analytics</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 md:gap-6">
                {/* Motivated to Improve - Left top (6 cols) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-6 bg-card border p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Motivated to Improve</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Your skills finally get credit.</p>
                    </div>
                    <div className="w-full h-40 md:h-48 bg-secondary mt-4" />
                </div>

                {/* Keep Your Record - Right (4 cols, spans 2 rows) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 bg-card border p-6 md:p-8 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Keep Your Record</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Your performance goes with you.</p>
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="w-full h-48 md:h-56 bg-secondary" />
                    </div>
                </div>

                {/* Driver of the Day - Left bottom left (3 cols) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <p className="text-xs md:text-sm font-semibold mb-4">Driver of the Day!</p>
                        <p className="text-xs md:text-sm text-muted-foreground">Congratulations!</p>
                    </div>
                    <div className="w-24 md:w-32 h-24 md:h-32 bg-secondary mx-auto" />
                </div>

                {/* More Rewarding Driving - Left bottom right (3 cols) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-card border p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">More Rewarding Driving</h3>
                        <p className="text-sm md:text-base text-muted-foreground">Badges and competition keep you moving forward.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}