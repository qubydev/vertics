import React from 'react';

export default function Proof() {
    return (
        <div className="max-w-5xl w-full mx-auto flex items-center justify-center py-8 px-6">
            <div className='flex w-full items-center justify-between text-center max-w-3xl'>
                <div className="px-2">
                    <p className="text-2xl md:text-4xl font-bold">500+</p>
                    <p className="text-xs md:text-base text-muted-foreground mt-2">websites tracked</p>
                </div>

                <div className='w-[1px] h-16 bg-border' />

                <div className="px-2">
                    <p className="text-2xl md:text-4xl font-bold">1k+</p>
                    <p className="text-xs md:text-base text-muted-foreground mt-2">traffic analyzed</p>
                </div>

                <div className='w-[1px] h-16 bg-border' />

                <div className="px-2">
                    <p className="text-2xl md:text-4xl font-bold">100+</p>
                    <p className="text-xs md:text-base text-muted-foreground mt-2">active users</p>
                </div>
            </div>
        </div>
    )
}