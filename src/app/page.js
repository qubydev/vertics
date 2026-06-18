import Link from "next/link"
import Navbar from "@/components/navbar"
import { Globe } from "@/components/ui/globe"

export default function Page() {
  return (
    <div className="relative h-[70vh] md:min-h-screen w-full overflow-hidden bg-background">
      <div className="fixed top-0 left-0 w-screen z-50 flex items-center justify-center sm:pt-6">
        <Navbar />
      </div>

      <div className="absolute top-[40%] md:top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full flex justify-center pointer-events-none">
        <h1 className="text-[25vw] md:text-[18vw] font-black tracking-tighter uppercase whitespace-nowrap leading-none select-none bg-gradient-to-b from-primary from-50% to-secondary bg-clip-text text-transparent">
          VERTICS
        </h1>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[45vh] md:h-[60vh] z-10 pointer-events-none">
        <Globe
          className="top-auto bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] md:translate-y-[50%] w-[150%] md:w-[120%] lg:w-full max-w-5xl pointer-events-auto"
        />

        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>
    </div>
  )
}