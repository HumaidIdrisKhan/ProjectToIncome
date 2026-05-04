import Link from "next/link"
import { Sparkles } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-12 md:flex-row md:items-center md:px-6">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/15 ring-1 ring-emerald/30">
              <Sparkles className="h-4 w-4 text-emerald" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Project<span className="text-emerald">·</span>Income
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Helping student builders turn experiments into revenue. Built with Next.js & Hugging Face.
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm md:grid-cols-3">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link href="/app" className="text-muted-foreground transition-colors hover:text-foreground">
            Engine
          </Link>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-muted-foreground md:px-6">
          <span>© {new Date().getFullYear()} Project-to-Income Engine</span>
          <span>Made for student founders</span>
        </div>
      </div>
    </footer>
  )
}
