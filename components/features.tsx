import { Coins, Target, LineChart } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "Monetization Ideas",
    description:
      "Get a tailored list of ways to make money from your project — subscriptions, ads, marketplaces, freemium, and more.",
  },
  {
    icon: Target,
    title: "Target Audience Detection",
    description:
      "Discover who actually wants what you're building, with personas, pain points, and acquisition channels.",
  },
  {
    icon: LineChart,
    title: "Pricing Strategy",
    description:
      "Anchor prices, tier suggestions, and value-based positioning so your numbers feel right from day one.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Everything you need to ship a <span className="text-emerald">real business</span>
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Stop second-guessing your idea. Three structured outputs, generated in seconds.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:border-emerald/40"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
            />
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15 ring-1 ring-emerald/30">
                <f.icon className="h-5 w-5 text-emerald" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
