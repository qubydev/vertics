import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <h1 className="text-center font-bold text-2xl md:text-3xl tracking-tighter mb-12 md:mb-16">
                Frequent <span className="text-muted-foreground">Questions</span>
            </h1>

            <div className="max-w-3xl mx-auto flex flex-col gap-3">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border px-4">
                        <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                            How long does setup take?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground">
                            Less than a minute. Add your website, copy your token, and paste a single script tag into your application.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border px-4 mt-3">
                        <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                            Does the script affect website performance?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground">
                            No. The tracking script is lightweight and loaded asynchronously to minimize any impact on page performance.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border px-4 mt-3">
                        <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                            What analytics are available?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground">
                            Track visitors, page views, traffic trends, live activity, countries, browsers, operating systems, devices, and more from a single dashboard.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border px-4 mt-3">
                        <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                            Can I track multiple websites?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground">
                            Yes. You can create and manage multiple websites from the same account and view analytics for each separately.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border px-4 mt-3">
                        <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                            Is the tracking token safe to expose?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground">
                            Yes. The token is designed to be used in client-side code and does not provide access to your account or dashboard.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6" className="border px-4 mt-3">
                        <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline">
                            Do I need to install an SDK?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm md:text-base text-muted-foreground">
                            No. Everything works through a single script tag. No packages, SDKs, or framework-specific integrations are required.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}