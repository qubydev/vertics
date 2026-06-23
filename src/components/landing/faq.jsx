import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    const faqsCol1 = [
        {
            value: "item-1",
            question: "How long does setup take?",
            answer: "Less than a minute. Add your website, copy your token, and paste a single script tag into your application."
        },
        {
            value: "item-3",
            question: "What analytics are available?",
            answer: "Track visitors, page views, traffic trends, live activity, countries, browsers, operating systems, devices, and more from a single dashboard."
        },
        {
            value: "item-5",
            question: "Is the tracking token safe to expose?",
            answer: "Yes. The token is designed to be used in client-side code and does not provide access to your account or dashboard."
        }
    ];

    const faqsCol2 = [
        {
            value: "item-2",
            question: "Does the script affect website performance?",
            answer: "No. The tracking script is lightweight and loaded asynchronously to minimize any impact on page performance."
        },
        {
            value: "item-4",
            question: "Can I track multiple websites?",
            answer: "Yes. You can create and manage multiple websites from the same account and view analytics for each separately."
        },
        {
            value: "item-6",
            question: "Do I need to install an SDK?",
            answer: "No. Everything works through a single script tag. No packages, SDKs, or framework-specific integrations are required."
        }
    ];

    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-16 md:py-20">
            <h1 className="text-center font-bold text-2xl md:text-3xl tracking-tighter mb-12 md:mb-16">
                Frequent <span className="text-muted-foreground">Questions</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start w-full">
                <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                    {faqsCol1.map((faq) => (
                        <AccordionItem key={faq.value} value={faq.value} className="border px-4 bg-card rounded-none">
                            <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4 [&[data-state=open]>span]:line-clamp-none">
                                <span className="line-clamp-1 text-left flex-1 pr-4">
                                    {faq.question}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-muted-foreground pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
                    {faqsCol2.map((faq) => (
                        <AccordionItem key={faq.value} value={faq.value} className="border px-4 bg-card rounded-none">
                            <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4 [&[data-state=open]>span]:line-clamp-none">
                                <span className="line-clamp-1 text-left flex-1 pr-4">
                                    {faq.question}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-muted-foreground pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}