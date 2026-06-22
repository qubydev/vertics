import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <div className="border p-8 md:p-12 text-center flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                    Start Tracking Today
                </h1>

                <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl">
                    Add a single script to your website and get visitor insights,
                    live activity, traffic sources, device analytics, and more in seconds.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button size="lg">
                        Get Started
                    </Button>

                    <Button variant="outline" size="lg">
                        View Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}