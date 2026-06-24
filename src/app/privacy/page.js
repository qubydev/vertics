import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";

export const metadata = {
    title: "Privacy | Vertics",
    description: "How Vertics handles analytics data.",
};

export default function PrivacyPage() {
    return (
        <div className="pt-18 sm:pt-24 flex min-h-screen flex-col bg-background">
            <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto">
                <div className="max-w-264 w-full sm:px-4 sm:pt-4">
                    <Navbar />
                </div>
            </div>

            <main className="w-full max-w-3xl mx-auto px-4 py-16 flex flex-col gap-8">
                <div className="flex flex-col gap-3 border-b border-border pb-8">
                    <p className="text-sm font-bold uppercase tracking-tight text-muted-foreground">Legal</p>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-foreground">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground">Last updated: June 24, 2026</p>
                </div>

                <section className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
                    <p>
                        Vertics collects lightweight website analytics so site owners can understand traffic, referrers, devices, browsers, countries, and page activity.
                    </p>
                    <p>
                        We store anonymous visitor and session identifiers, page paths, referrer information, device metadata, approximate location, event timestamps, and event durations. We do not ask site owners to send personal information through the tracking script.
                    </p>
                    <p>
                        Analytics data is used to provide dashboards, realtime counts, trend metrics, and aggregate reports. We do not sell analytics data.
                    </p>
                    <p>
                        Site owners are responsible for disclosing their use of Vertics to their visitors where required by law.
                    </p>
                    <p>
                        To request deletion or ask privacy questions, contact Vertics through the official support channel listed by the project owner.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
