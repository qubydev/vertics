import Navbar from "@/components/navbar"
import Hero from "@/components/landing/hero"
import Proof from "@/components/landing/proof"
import Integration from "@/components/landing/integration"
import Features from "@/components/landing/features"
import FAQ from "@/components/landing/faq"
import CTA from "@/components/landing/cta"
import Footer from "@/components/landing/footer"

export default function Page() {
  return (
    <div className="pt-24 flex flex-col">
      <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto">
        <div className="max-w-264 w-full sm:px-4 sm:pt-4">
          <Navbar />
        </div>
      </div>

      <Hero />
      <Proof />
      <Integration />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}