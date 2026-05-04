import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"
import { EngineView } from "@/components/engine-view"


export const metadata = {
  title: "Engine — Project-to-Income",
  description: "Generate monetization, target users, and pricing for your project idea.",
}

export default function AppPage() {
  return (
    <main className="min-h-dvh">
      <SiteNavbar />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 40% at 50% 0%, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 40%, transparent 75%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-4 pt-14 pb-6 md:px-6 md:pt-20">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Engine
          </div>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Generate your <span className="text-emerald">income strategy</span>
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Describe your project. We&apos;ll suggest monetization paths, target users, pricing tiers, and a
            recommended business model.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
        <EngineView />
      </section>

      <SiteFooter />
    </main>
  )
}
