import { SiteNavbar } from "@/components/site-navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <SiteNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <SiteFooter />
    </main>
  )
}
