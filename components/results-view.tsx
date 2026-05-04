"use client"

import { useState } from "react"
import {
  Coins,
  Users,
  Tag,
  Briefcase,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Strategy } from "@/components/project-form"
import ViabilityCircle from "@/components/ViabilityCircle"

type Props = {
  strategy: Strategy
  idea: string
  category: string
  source?: string
  onRegenerate: () => void
  regenerating: boolean
}

function strategyToText(s: Strategy, idea: string) {
  return [
    `Project: ${idea}`,
    "",
    "Monetization Suggestions:",
    ...s.monetization.map((m) => `• ${m}`),
    "",
    "Target Users:",
    ...s.targetUsers.map((u) => `• ${u}`),
    "",
    "Pricing Ideas:",
    ...s.pricingIdeas.map((p) => `• ${p}`),
    "",
    "Business Model:",
    s.businessModel,
    "",
    `Viability Score: ${s.viabilityScore}/100`,
  ].join("\n")
}

function ResultCard({
  icon: Icon,
  title,
  children,
  onCopy,
  copied,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
  onCopy: () => void
  copied: boolean
}) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-emerald/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald/10 blur-2xl"
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/15 ring-1 ring-emerald/30">
            <Icon className="h-4.5 w-4.5 text-emerald" />
          </span>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCopy}
          className="h-8 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
          aria-label={`Copy ${title}`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="relative mt-5">{children}</div>
    </div>
  )
}

export function ResultsView({ strategy, idea, category, source, onRegenerate, regenerating }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800)
    } catch {
      toast.error("Failed to copy")
    }
  }

  const allText = strategyToText(strategy, idea)

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-emerald" />
          <span>
            Strategy generated
            {category && category !== "any" ? ` for ${category}` : ""}
            {source === "mock" ? " · demo data" : source === "fallback" ? " · fallback" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => copy("all", allText)}
            className="rounded-xl border-border/70"
          >
            {copiedKey === "all" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald" />
                Copied all
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy all
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onRegenerate}
            disabled={regenerating}
            className="rounded-xl bg-emerald text-primary-foreground hover:bg-emerald/90"
          >
            {regenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Regenerating
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex justify-center">
          <ViabilityCircle score={strategy.viabilityScore} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ResultCard
          icon={Coins}
          title="Monetization Suggestions"
          copied={copiedKey === "monetization"}
          onCopy={() => copy("monetization", strategy.monetization.map((m) => `• ${m}`).join("\n"))}
        >
          <ul className="space-y-3">
            {strategy.monetization.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                <span className="text-foreground/90">{m}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard
          icon={Users}
          title="Target Users"
          copied={copiedKey === "targetUsers"}
          onCopy={() => copy("targetUsers", strategy.targetUsers.map((u) => `• ${u}`).join("\n"))}
        >
          <ul className="space-y-3">
            {strategy.targetUsers.map((u, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                <span className="text-foreground/90">{u}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard
          icon={Tag}
          title="Pricing Ideas"
          copied={copiedKey === "pricing"}
          onCopy={() => copy("pricing", strategy.pricingIdeas.map((p) => `• ${p}`).join("\n"))}
        >
          <ul className="space-y-3">
            {strategy.pricingIdeas.map((p, i) => (
              <li
                key={i}
                className="rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-sm leading-relaxed"
              >
                {p}
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard
          icon={Briefcase}
          title="Business Model"
          copied={copiedKey === "businessModel"}
          onCopy={() => copy("businessModel", strategy.businessModel)}
        >
          <p className="text-sm leading-relaxed text-foreground/90">{strategy.businessModel}</p>
        </ResultCard>
      </div>
    </section>
  )
}