import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Shield } from "lucide-react";
import Navbar from "@/components/navbar";


export default function Page() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen z-99 flex items-center justify-center sm:pt-6">
        <Navbar />
      </div>
    </div>
  )
}