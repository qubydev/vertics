import Navbar from "@/components/navbar";
import Footer from "@/components/landing/footer";

export const metadata = {
    title: "Terms | Vertics",
    description: "Terms for using Vertics.",
};

export default function TermsPage() {
    return (
        <div className="pt-24 flex min-h-screen flex-col bg-background">
            <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto">
                <div className="max-w-264 w-full sm:px-4 sm:pt-4">
                    <Navbar />
                </div>
            </div>

            <main className="w-full max-w-3xl mx-auto px-4 py-16 flex flex-col gap-8">
                <div className="flex flex-col gap-3 border-b border-border pb-8">
                    <p className="text-sm font-bold uppercase tracking-tight text-muted-foreground">Legal</p>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-foreground">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground">Last updated: June 24, 2026</p>
                </div>

                <section className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
                    <p>
                        By using Vertics, you agree to use the service responsibly and only on websites you own or are authorized to monitor.
                    </p>
                    <p>
                        You must not use Vertics to collect sensitive personal information, track users unlawfully, overload the service, or interfere with other users.
                    </p>
                    <p>
                        Vertics is provided as-is. We aim to keep analytics reliable, but we do not guarantee uninterrupted availability or perfect data accuracy.
                    </p>
                    <p>
                        You are responsible for your website content, your tracking setup, and any notices or consent requirements that apply to your visitors.
                    </p>
                    <p>
                        We may update these terms as the product evolves. Continued use of Vertics means you accept the latest terms.
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
