import Globe from "@/components/globe"
import { Button } from "../ui/button"

export default function Hero() {
    return (
        <div className="max-w-5xl w-full mx-auto">
            <div className="pt-8 md:pt-16 sm:pt px-4 relative z-10">
                <div className="text-center flex items-center justify-center flex-col">
                    <div className="font-bold tracking-tighter text-4xl md:text-6xl leading-none">
                        <h1>Track Everything</h1>
                        <h1>
                            with One <span className="text-muted-foreground">{"<script>"}</span>
                        </h1>
                    </div>

                    <p className="text-muted-foreground mt-3 text-base md:text-lg leading-relaxed max-w-xs md:max-w-2xl">
                        Traffic, performance, and user behavior in seconds.
                    </p>

                    <Button
                        className="mt-2 text-sm font-medium"
                        size="lg"
                    >
                        Get started
                    </Button>
                </div>
            </div>

            <div className="relative -translate-y-[1%] z-0 aspect-5/2 overflow-hidden">
                <Globe />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background"></div>
            </div>
        </div>
    )
}