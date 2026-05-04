import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 -z-10 bg-background/60 backdrop-blur-xl border-b border-border/60" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald/15 ring-1 ring-emerald/30">
            <Sparkles className="h-4 w-4 text-emerald" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Project<span className="text-emerald">·</span>Income
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link href="/app" className="transition-colors hover:text-foreground">
            Engine
          </Link>
        </nav>

        <Button
          asChild
          size="sm"
          className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-xl"
        >
          <Link href="/app">Start Now</Link>
        </Button>
      </div>
    </header>
  )
}
