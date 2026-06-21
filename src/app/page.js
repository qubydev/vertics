import Navbar from "@/components/navbar"
import Hero from "@/components/landing/hero"

export default function Page() {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen flex items-center justify-center z-50 mx-auto sm:px-4 sm:pt-4">
        <div className="max-w-5xl w-full">
          <Navbar />
        </div>
      </div>

      <Hero />

    </>
  )
}