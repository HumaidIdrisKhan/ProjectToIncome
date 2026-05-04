"use client"

import { useRef, useState, type FormEvent } from "react"
import { Wand2, Loader2, Eraser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Strategy = {
  monetization: string[]
  targetUsers: string[]
  pricingIdeas: string[]
  businessModel: string
}

type Props = {
  /** Called when validation passes and the request is starting. */
  onStart: () => void
  /** Called on a successful API response. */
  onResult: (strategy: Strategy, meta: { idea: string; category: string; source?: string }) => void
  /** Called on validation failure or any error so parent can leave the loading state. */
  onError: (message: string) => void
  /** Called when the user clicks "Clear" to reset everything. */
  onClear: () => void
  /** Whether the parent is currently in a loading state. */
  loading: boolean
  /** Whether a result is currently displayed (controls the visibility of the Clear button). */
  hasResult: boolean
}

const CATEGORIES = [
  { value: "any", label: "Any category" },
  { value: "AI", label: "AI / ML" },
  { value: "Web", label: "Web App" },
  { value: "Mobile", label: "Mobile App" },
  { value: "SaaS", label: "SaaS" },
  { value: "Hardware", label: "Hardware / IoT" },
  { value: "Education", label: "Education" },
  { value: "Creator", label: "Creator Tools" },
  { value: "Other", label: "Other" },
]

const MIN_LEN = 10

export function ProjectForm({ onStart, onResult, onError, onClear, loading, hasResult }: Props) {
  const [idea, setIdea] = useState("")
  const [category, setCategory] = useState("any")
  const [error, setError] = useState<string | null>(null)
  // Guard against double-submits (e.g. Enter while a request is in flight).
  const inFlight = useRef(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (loading || inFlight.current) {
      console.log("[v0] submit ignored: request in flight")
      return
    }

    const trimmed = idea.trim()
    setError(null)

    if (trimmed.length === 0 || trimmed.length < MIN_LEN) {
      const msg = "Please enter a meaningful project idea."
      setError(msg)
      toast.error(msg)
      return
    }

    inFlight.current = true
    onStart()
    console.log("[v0] generate input:", { idea: trimmed, category })

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: trimmed, category }),
      })

      const data = await res.json().catch(() => null)
      console.log("[v0] generate response:", data)

      if (!res.ok) {
        const msg = data?.error ?? "Something went wrong. Please try again."
        setError(msg)
        toast.error(msg)
        onError(msg)
        return
      }

      if (!data || !data.strategy) {
        const msg = "No useful response generated. Try a better idea."
        setError(msg)
        toast.error(msg)
        onError(msg)
        return
      }

      onResult(data.strategy as Strategy, { idea: trimmed, category, source: data.source })
    } catch (err) {
      const msg = "Network error. Please try again."
      console.log("[v0] generate failed:", (err as Error).message)
      setError(msg)
      toast.error(msg)
      onError(msg)
    } finally {
      // Always release the lock so subsequent submissions work.
      inFlight.current = false
    }
  }

  function handleClear() {
    setIdea("")
    setCategory("any")
    setError(null)
    onClear()
  }

  const tooShort = idea.trim().length > 0 && idea.trim().length < MIN_LEN

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 md:p-7" noValidate>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="idea" className="text-sm font-medium">
              Your project idea
            </Label>
            {idea.length > 0 ? (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label="Clear input"
              >
                <Eraser className="h-3.5 w-3.5" />
                Clear
              </button>
            ) : null}
          </div>
          <Textarea
            id="idea"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Describe your project idea... e.g. 'A study planner that uses AI to break down syllabi into daily tasks for students.'"
            rows={6}
            className="resize-none rounded-xl border-border/70 bg-background/50 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-emerald/40"
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby={error ? "idea-error" : undefined}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {tooShort
                ? `${MIN_LEN - idea.trim().length} more characters needed`
                : "Tip: include who it’s for and what problem it solves."}
            </span>
            <span className={idea.length > 1000 ? "text-destructive" : ""}>{idea.length}/1500</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[200px_1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger id="category" className="rounded-xl border-border/70 bg-background/50">
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading || idea.trim().length < MIN_LEN}
            size="lg"
            className="rounded-xl bg-emerald text-primary-foreground hover:bg-emerald/90 glow-emerald"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                {hasResult ? "Generate again" : "Generate"}
              </>
            )}
          </Button>

          {hasResult ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={loading}
              onClick={handleClear}
              className="rounded-xl border-border/70"
            >
              <Eraser className="h-4 w-4" />
              Reset
            </Button>
          ) : null}
        </div>

        {error ? (
          <p
            id="idea-error"
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground"
          >
            {error}
          </p>
        ) : null}
      </div>
    </form>
  )
}
