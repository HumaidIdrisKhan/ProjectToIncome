import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Project-to-Income Engine — Turn Your Project Into Income",
  description:
    "From student ideas to real-world revenue opportunities. Get monetization suggestions, target users, and pricing strategies for your project.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0a0f0d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <Toaster theme="dark" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
