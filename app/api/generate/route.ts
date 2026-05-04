import { NextResponse } from "next/server"

export const runtime = "nodejs"

type GenerateRequest = {
  idea?: string
  category?: string
}

type Strategy = {
  monetization: string[]
  targetUsers: string[]
  pricingIdeas: string[]
  businessModel: string
  viabilityScore: number
}

const DEFAULT_MODEL = "llama-3.3-70b-versatile"

function buildPrompt(idea: string, category?: string) {
  const cat =
    category && category.trim() && category.trim() !== "any"
      ? `Category: ${category.trim()}\n`
      : ""

  return `
You are a highly critical startup investor and business analyst.

Return ONLY valid JSON. No markdown. No explanation. No code fences.

Use this exact shape:
{
  "monetization": ["", "", "", ""],
  "targetUsers": ["", "", ""],
  "pricingIdeas": ["", "", ""],
  "businessModel": "",
  "viabilityScore": 0
}

STRICT RULES:
- Be realistic and critical, not optimistic.
- Do NOT inflate scores.
- Do NOT give the same score to every idea.
- Strong ideas should usually score 70-90.
- Average ideas should usually score 40-69.
- Weak ideas should usually score below 40.
- viabilityScore must be a single integer from 0 to 100.
- Do not write "8/10", "85%", "good", or any text inside viabilityScore.

FIELD RULES:
- monetization: 4 concrete revenue paths, each 1 sentence long.
- targetUsers: 3 specific personas with a clear pain point.
- pricingIdeas: 3 realistic pricing tiers or plans with prices.
- businessModel: 1 to 2 sentences explaining how the business makes money.
- Make the content detailed enough to be useful in a hackathon demo.

${cat}Project idea: ${idea}
`.trim()
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{")
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escape = false

  for (let i = start; i < text.length; i++) {
    const ch = text[i]

    if (escape) {
      escape = false
      continue
    }

    if (ch === "\\") {
      escape = true
      continue
    }

    if (ch === '"') {
      inString = !inString
      continue
    }

    if (!inString) {
      if (ch === "{") depth++
      if (ch === "}") {
        depth--
        if (depth === 0) {
          return text.slice(start, i + 1)
        }
      }
    }
  }

  return null
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0)
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,|;/g)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return []
}

function normalizeScore(value: unknown): number {
  let score = 0

  if (typeof value === "number" && Number.isFinite(value)) {
    score = value
  } else if (typeof value === "string") {
    const match = value.match(/(\d+(?:\.\d+)?)/)
    score = match ? Number(match[1]) : 0
  }

  if (!Number.isFinite(score)) score = 0

  // Handle common 0-10 style outputs like "8/10".
  if (score > 0 && score <= 10) {
    score = score * 10
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function heuristicScoreAdjustment(idea: string, score: number): number {
  const text = idea.toLowerCase()

  let adjusted = score

  const strongSignals = [
    "ai",
    "platform",
    "saas",
    "business",
    "small businesses",
    "students",
    "workflow",
    "automation",
    "analytics",
    "subscription",
    "freelancer",
    "career",
    "study",
    "education",
    "marketing",
    "productivity",
    "marketplace",
    "tool",
  ]

  const weakSignals = [
    "nothing",
    "bullshit",
    "random",
    "fun facts",
    "emoji",
    "joke",
    "meme",
    "useless",
    "no idea",
    "nothing useful",
    "just for fun",
    "click a button",
    "daily mood",
  ]

  let strongCount = 0
  for (const s of strongSignals) {
    if (text.includes(s)) strongCount++
  }

  let weakCount = 0
  for (const s of weakSignals) {
    if (text.includes(s)) weakCount++
  }

  // Input quality signals
  if (idea.trim().length >= 120) adjusted += 4
  if (idea.trim().length >= 200) adjusted += 3
  if (idea.trim().length < 40) adjusted -= 8
  if (idea.trim().length < 20) adjusted -= 12

  // Helpful but not overly generous
  adjusted += Math.min(8, strongCount * 2)

  // Penalize vague or bad ideas
  adjusted -= Math.min(20, weakCount * 8)

  // If the idea is very short and vague, keep it low
  if (strongCount === 0 && idea.trim().length < 60) {
    adjusted -= 6
  }

  return Math.max(0, Math.min(100, Math.round(adjusted)))
}

function normalizeStrategy(raw: any, idea: string): Strategy | null {
  const monetization = toStringArray(raw?.monetization).slice(0, 4)
  const targetUsers = toStringArray(raw?.targetUsers).slice(0, 3)
  const pricingIdeas = toStringArray(raw?.pricingIdeas).slice(0, 3)
  const businessModel =
    typeof raw?.businessModel === "string" ? raw.businessModel.trim() : ""

  const rawScore = normalizeScore(raw?.viabilityScore)
  const viabilityScore = heuristicScoreAdjustment(idea, rawScore)

  if (
    !monetization.length ||
    !targetUsers.length ||
    !pricingIdeas.length ||
    !businessModel
  ) {
    return null
  }

  return {
    monetization,
    targetUsers,
    pricingIdeas,
    businessModel,
    viabilityScore,
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateRequest
    const idea = (body.idea ?? "").trim()
    const category = (body.category ?? "").trim()

    if (!idea || idea.length < 10) {
      return NextResponse.json(
        { error: "Please enter a meaningful project idea." },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key missing." },
        { status: 500 }
      )
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are a startup investor. Return only valid JSON that matches the requested schema exactly.",
              },
              {
                role: "user",
                content: buildPrompt(idea, category),
              },
            ],
            temperature: 0.2,
            max_tokens: 1400,
            top_p: 0.9,
            stream: false,
          }),
          signal: controller.signal,
        }
      )

      const rawText = await response.text()

      if (!response.ok) {
        return NextResponse.json(
          {
            error: `Groq API error (${response.status}).`,
            details: rawText.slice(0, 500),
          },
          { status: 500 }
        )
      }

      let payload: any
      try {
        payload = JSON.parse(rawText)
      } catch {
        return NextResponse.json(
          {
            error: "Groq returned invalid response.",
            details: rawText.slice(0, 500),
          },
          { status: 500 }
        )
      }

      const content = payload?.choices?.[0]?.message?.content ?? ""
      const jsonText = extractJsonObject(content)

      if (!jsonText) {
        return NextResponse.json(
          {
            error: "Model did not return valid JSON.",
            details: content.slice(0, 500),
          },
          { status: 500 }
        )
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(jsonText)
      } catch {
        return NextResponse.json(
          {
            error: "Could not parse model JSON.",
            details: jsonText.slice(0, 500),
          },
          { status: 500 }
        )
      }

      const strategy = normalizeStrategy(parsed, idea)
      if (!strategy) {
        return NextResponse.json(
          {
            error: "AI response missing required fields.",
            details: jsonText.slice(0, 500),
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        strategy,
        source: "groq",
      })
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Request timed out while waiting for Groq."
        : error instanceof Error
          ? error.message
          : "Something went wrong."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}