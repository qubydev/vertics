import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Vertics Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl tracking-tight text-foreground">Vertics</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
            <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">
              Log in
            </Link>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative px-4 pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48 overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary/20 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 text-balance">
              Analytics without the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">clutter.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto text-balance">
              Lightweight, privacy-friendly visitor tracking. Drop in our script and get instant insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8" asChild>
                <Link href="/login">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="py-24 bg-muted/40 border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How it works</h2>
              <p className="mt-4 text-lg text-muted-foreground">Three simple steps to supercharge your workflow.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { icon: Zap, title: "1. Connect", desc: "Integrate our lightweight script or SDK into your project in under 2 minutes." },
                { icon: Shield, title: "2. Secure", desc: "Authentication and data privacy are handled automatically behind the scenes." },
                { icon: BarChart3, title: "3. Analyze", desc: "Watch real-time insights flow into your beautiful, pre-configured dashboard." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="testimonials" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Loved by builders</h2>
              <p className="mt-4 text-lg text-muted-foreground">Don't just take our word for it.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Jenkins", role: "Frontend Lead", quote: "This tool completely removed the headache of setting up our own analytics pipeline. The dashboard is stunning out of the box." },
                { name: "David Chen", role: "Indie Hacker", quote: "I went from zero to a fully authenticated app with visitor tracking in a single afternoon. Absolutely game-changing." },
                { name: "Maya Patel", role: "Product Manager", quote: "The clarity of the data and the crisp design of the interface makes reporting to stakeholders incredibly easy." }
              ].map((t, i) => (
                <div key={i} className="flex flex-col justify-between p-8 rounded-2xl bg-muted/30 border border-border">
                  <p className="text-foreground/90 italic mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="py-24 bg-muted/40 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently asked questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Do I need to enter a credit card to sign up?", a: "No, our free tier is completely free forever. You only pay when you need to scale beyond the basic limits." },
                { q: "How does the pricing work?", a: "We charge based on monthly tracked events and active users. Check our pricing page for a detailed breakdown." },
                { q: "Can I export my data?", a: "Yes, you own your data. You can export it at any time in CSV or JSON format from your dashboard settings." },
                { q: "Is it GDPR compliant?", a: "Absolutely. We are fully compliant with GDPR, CCPA, and PECR. We don't use cookies to track individual visitors across sites." }
              ].map((faq, i) => (
                <details key={i} className="group p-6 rounded-xl bg-background border border-border [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">Ready to start building?</h2>
            <p className="text-lg text-muted-foreground mb-10">Join thousands of developers shipping better products faster.</p>
            <Button size="lg" className="h-12 px-10 text-base" asChild>
              <Link href="/login">Create your free account</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Vertics Logo" className="h-6 w-auto grayscale opacity-70" />
            <span className="font-semibold text-muted-foreground">Vertics</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vertics Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}