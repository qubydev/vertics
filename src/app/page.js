import Navbar from "@/components/navbar"
import Hero from "@/components/landing/hero"
import Proof from "@/components/landing/proof"
import Integration from "@/components/landing/integration"

export default function Page() {
  return (
    <div className="pt-24 flex flex-col gap-16">
      <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto sm:px-4 sm:pt-4">
        <div className="max-w-5xl w-full">
          <Navbar />
        </div>
      </div>

      <Hero />
      <Proof />
      <Integration />

    </div>
  )
}