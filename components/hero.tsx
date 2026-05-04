import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 35%, transparent 70%)",
        }}
      />
      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at top, black 40%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 md:px-6 md:pt-28 md:pb-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs text-emerald">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built for student founders</span>
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Turn Your Project <span className="text-emerald">Into Income</span>
          </h1>

          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            From student ideas to real-world revenue opportunities. Describe your project and instantly get
            monetization paths, ideal customers, and pricing strategies.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-2xl px-6 glow-emerald"
            >
              <Link href="/app">
                Start Now
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-2xl text-muted-foreground hover:text-foreground"
            >
              <Link href="#features">See how it works</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            No signup needed · Free to try · Built with Hugging Face
          </p>
        </div>
      </div>
    </section>
  )
}
