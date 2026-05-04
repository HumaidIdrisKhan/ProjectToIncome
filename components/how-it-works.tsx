const steps = [
  {
    n: "01",
    title: "Describe your idea",
    body: "Paste a sentence or a paragraph. Optionally pick a category like AI, Web, or Mobile.",
  },
  {
    n: "02",
    title: "Generate strategy",
    body: "Our model analyzes your project and returns monetization, audience, and pricing in seconds.",
  },
  {
    n: "03",
    title: "Iterate & ship",
    body: "Copy the results, regenerate for new angles, and turn the best ones into your launch plan.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-24 md:px-6">
      <div className="glass rounded-3xl p-8 md:p-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-emerald">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">From idea to income in 3 steps</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Built for makers who want signal, not theory. Plug in your project and walk away with a clearer
            business angle.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-emerald/40"
            >
              <div className="font-mono text-xs text-emerald">{s.n}</div>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
