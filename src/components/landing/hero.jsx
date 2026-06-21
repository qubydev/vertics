import Globe from "@/components/globe"
import { Button } from "../ui/button"

export default function Hero() {
    return (
        <div className="max-w-5xl w-full mx-auto">
            <div className="pt-8 md:pt-16 sm:pt px-4 relative z-10">
                <div className="text-center flex items-center justify-center flex-col">
                    <div className="font-black tracking-tighter text-2xl md:text-4xl lg:text-5xl">
                        <h1>Web Analytics</h1>
                        <h1>with single <span className="text-blue-500">{"<script>"}</span></h1>
                    </div>

                    <p className="font-bold text-muted-foreground mt-2 text-sm md:text-base max-w-80 md:max-w-120">Add one script and start tracking traffic and performance in seconds.</p>
                    <Button
                        className="mt-4"
                    >Get started</Button>
                </div>
            </div>

            <div className="relative -translate-y-[1%] z-0 aspect-5/2 overflow-hidden">
                <Globe />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background"></div>
            </div>
        </div>
    )
}