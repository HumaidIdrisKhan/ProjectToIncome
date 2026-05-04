"use client"

import { useState } from "react"
import { ProjectForm, type Strategy } from "@/components/project-form"
import { ResultsSkeleton } from "@/components/results-skeleton"
import { ResultsView } from "@/components/results-view"
import { Lightbulb } from "lucide-react"
import { toast } from "sonner"

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "results"; strategy: Strategy; idea: string; category: string; source?: string }

export function EngineView() {
  const [state, setState] = useState<State>({ kind: "idle" })
  const [regenerating, setRegenerating] = useState(false)

  async function regenerate() {
    if (state.kind !== "results" || regenerating) return
    setRegenerating(true)
    console.log("[v0] regenerate input:", { idea: state.idea, category: state.category })
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: state.idea, category: state.category }),
      })
      const data = await res.json().catch(() => null)
      console.log("[v0] regenerate response:", data)
      if (!res.ok || !data?.strategy) {
        toast.error(data?.error ?? "No useful response generated. Try a better idea.")
        return
      }
      setState({
        kind: "results",
        strategy: data.strategy,
        idea: state.idea,
        category: state.category,
        source: data.source,
      })
      toast.success("Strategy regenerated")
    } catch (err) {
      console.log("[v0] regenerate failed:", (err as Error).message)
      toast.error("Network error. Please try again.")
    } finally {
      setRegenerating(false)
    }
  }

  function clearAll() {
    setState({ kind: "idle" })
  }

  return (
    <div className="flex flex-col gap-8">
      <ProjectForm
        loading={state.kind === "loading"}
        onStart={() => setState({ kind: "loading" })}
        onError={() => {
          // Always exit loading on error so subsequent submits work and the skeleton clears.
          setState((s) => (s.kind === "loading" ? { kind: "idle" } : s))
        }}
        onResult={(strategy, meta) =>
          setState({
            kind: "results",
            strategy,
            idea: meta.idea,
            category: meta.category,
            source: meta.source,
          })
        }
        onClear={clearAll}
        hasResult={state.kind === "results"}
      />

      <div className="min-h-[200px]">
        {state.kind === "idle" ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15 ring-1 ring-emerald/30">
              <Lightbulb className="h-5 w-5 text-emerald" />
            </span>
            <h3 className="mt-4 text-base font-semibold">Your strategy will appear here</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Describe your idea above and click <span className="text-foreground">Generate</span> to see
              monetization, target users, and pricing ideas.
            </p>
          </div>
        ) : null}

        {state.kind === "loading" ? <ResultsSkeleton /> : null}

        {state.kind === "results" ? (
          <ResultsView
            strategy={state.strategy}
            idea={state.idea}
            category={state.category}
            source={state.source}
            onRegenerate={regenerate}
            regenerating={regenerating}
          />
        ) : null}
      </div>
    </div>
  )
}
