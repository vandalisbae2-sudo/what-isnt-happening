import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  CATEGORIES,
  featuredNonEvent,
  itemsForCategory,
  nonEvents,
  type Category,
  type NonEvent,
} from "@/data/isnt-happening"
import { cn } from "@/lib/utils"

const SITE_TITLE = "What Isn’t Happening"

function categoryDomId(category: Category): string {
  return `category-${category
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")}`
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") {
      return true
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => {
      setReduced(media.matches)
    }
    onChange()
    media.addEventListener("change", onChange)
    return () => {
      media.removeEventListener("change", onChange)
    }
  }, [])

  return reduced
}

function ViewerLocalClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => {
      window.clearInterval(id)
    }
  }, [])

  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  })
  const day = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const zone =
    new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value ?? "local"

  return (
    <div className="border-border bg-card max-w-full rounded-xl border px-4 py-3">
      <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
        Viewer local time
      </p>
      <p className="mt-1 font-mono text-2xl tracking-tight tabular-nums">{time}</p>
      <p className="text-muted-foreground mt-1 text-sm">
        {zone} · {day}
      </p>
      <p className="text-muted-foreground mt-2 text-xs">
        Live clock on this device. Not a newsroom wire.
      </p>
    </div>
  )
}

function NonEventCard({
  item,
  featured = false,
}: {
  item: NonEvent
  featured?: boolean
}) {
  return (
    <Card className={cn("h-full shadow-none", featured && "gap-4")}>
      <CardHeader className="flex-1">
        {featured ? (
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Featured</Badge>
            <span className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
              {item.category}
            </span>
          </div>
        ) : null}
        <CardTitle
          className={
            featured
              ? "text-2xl leading-snug font-semibold sm:text-3xl"
              : "text-base leading-snug font-medium"
          }
        >
          {item.headline}
        </CardTitle>
        {item.detail ? <CardDescription>{item.detail}</CardDescription> : null}
      </CardHeader>
      <CardFooter className="mt-auto">
        <Badge variant="outline">Confidence: {item.confidence}%</Badge>
      </CardFooter>
    </Card>
  )
}

function Ticker({ items }: { items: readonly NonEvent[] }) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return (
      <ScrollArea
        orientation="horizontal"
        className="border-border w-full border-t"
        aria-label="Non-event headlines, repeated from the sections above. Scroll manually."
      >
        <div className="flex w-max gap-8 px-4 py-3">
          {items.map((item) => (
            <span key={item.id} className="text-sm">
              {item.headline}
            </span>
          ))}
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="ticker-viewport border-border w-full max-w-full overflow-hidden border-t" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) =>
          items.map((item) => (
            <span key={`${item.id}-${copy}`} className="px-4 py-3 text-sm whitespace-nowrap">
              {item.headline}
              <span className="text-muted-foreground px-4">/</span>
            </span>
          )),
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <a
        href="#dashboard"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-2 focus:ring-ring"
      >
        Skip to dashboard
      </a>
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 sm:px-6">
          <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
            Fictional entertainment
          </p>
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">{SITE_TITLE}</p>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Invented non-events, delivered straight. This is not a news service, a market report, or financial information.
          </p>
        </div>
      </header>
      <main id="dashboard">
        <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0">
              <h1 id="hero-title" className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {SITE_TITLE}
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl text-base">
                One desk of things that are not occurring. The first World News item is featured. Every report carries the same confidence.
              </p>
            </div>
            <ViewerLocalClock />
          </div>
          <div className="mt-8 min-w-0">
            <NonEventCard item={featuredNonEvent} featured />
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          {CATEGORIES.map((category, index) => {
            const items = itemsForCategory(category)
            const headingId = categoryDomId(category)
            return (
              <section key={category} aria-labelledby={headingId}>
                <Separator className={index === 0 ? "mb-10" : "my-10"} />
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 id={headingId} className="text-xl font-semibold tracking-tight">
                    {category}
                  </h2>
                  <p className="text-muted-foreground text-sm whitespace-nowrap">8 non-events</p>
                </div>
                <ul className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {items.map((item) => (
                    <li key={item.id} className="min-w-0">
                      <NonEventCard item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="text-xs font-medium tracking-[0.16em] uppercase">Non-event ticker</p>
          <p className="text-muted-foreground text-xs">Repeats the same 72 reports</p>
        </div>
        <Ticker items={nonEvents} />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-muted-foreground text-sm">
            Fictional entertainment only. Nothing on this page is news, a quote, a forecast, or financial advice. The confidence figure is part of the fiction.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
