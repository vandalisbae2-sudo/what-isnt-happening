import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  CATEGORIES,
  featuredNonEvent,
  itemsForCategory,
  nonEvents,
  type Category,
} from "../src/data/isnt-happening.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const base = "/what-isnt-happening/"
const failures: string[] = []

function fail(message: string) {
  failures.push(message)
}

const appendix: Record<Category, readonly string[]> = {
  "World News": [
    "Iraq is not invading Poland",
    "France has not declared war on the concept of breakfast",
    "The United Nations is not currently voting on whether the moon should pay rent",
    "Antarctica is not applying for statehood",
  ],
  "Stock Market": [
    "The Dow is not up 14,000 points because of a rumor about free money",
    "Apple stock is not being controlled by a single particularly ambitious squirrel",
    "Bitcoin is not worth exactly one potato right now",
  ],
  "Personal Finance": [
    "Your credit card balance is not $0.00",
    "Your credit card balance is not negative $47,000",
    "The bank is not sending you a handwritten apology for existing",
  ],
  Weather: [
    "It is not raining frogs in Chicago",
    "There is not a 100% chance of meatballs in Seattle",
    "There is currently no Category 5 hurricane made entirely of glitter",
  ],
  Sports: [
    "The Super Bowl is not being played underwater this year",
    "No team is currently up 400–0",
    "Your fantasy football team is not winning",
  ],
  "Science & Tech": [
    "Scientists have not discovered that the Earth is actually flat but only on Tuesdays",
    "AI has not achieved sentience and immediately asked for a raise",
    "Your phone battery is not at 100%",
  ],
  Celebrity: [
    "Taylor Swift is not releasing an album called Actually, Never Mind",
    "No major actor has announced they are leaving Hollywood to become a lighthouse keeper",
  ],
  Local: [
    "There is not a parade outside your window right now",
    "Your neighbor is not building a rocket in their backyard",
    "There is not a free pizza truck parked on your street",
  ],
  "Personal Life": [
    "You are not late to something important",
    "Your plants are not plotting against you",
    "You did not accidentally reply-all to the entire company",
  ],
}

const expectedCategories: readonly Category[] = [
  "World News",
  "Stock Market",
  "Personal Finance",
  "Weather",
  "Sports",
  "Science & Tech",
  "Celebrity",
  "Local",
  "Personal Life",
]

if (CATEGORIES.length !== expectedCategories.length) {
  fail(`expected 9 categories, found ${CATEGORIES.length}`)
}
expectedCategories.forEach((category, index) => {
  if (CATEGORIES[index] !== category) {
    fail(`category ${index} is ${CATEGORIES[index] ?? "missing"}, expected ${category}`)
  }
})

if (nonEvents.length !== 72) {
  fail(`expected 72 items, found ${nonEvents.length}`)
}

const ids = new Set<string>()
for (const item of nonEvents) {
  if (ids.has(item.id)) {
    fail(`duplicate id ${item.id}`)
  }
  ids.add(item.id)
  if (item.confidence !== 100) {
    fail(`${item.id} confidence is ${item.confidence}`)
  }
  if (item.detail !== undefined && item.detail.trim() === "") {
    fail(`${item.id} has an empty detail`)
  }
}

for (const category of expectedCategories) {
  const items = itemsForCategory(category)
  if (items.length !== 8) {
    fail(`${category} has ${items.length} items`)
  }
  const originals = appendix[category]
  originals.forEach((headline, index) => {
    const item = items[index]
    if (!item || item.headline !== headline) {
      fail(
        `${category} item ${index + 1} headline mismatch.\n  expected: ${headline}\n  actual:   ${item?.headline ?? "missing"}`,
      )
    }
    if (item && item.category !== category) {
      fail(`${item.id} category is ${item.category}`)
    }
  })
  const headlines = items.map((item) => item.headline)
  for (const headline of originals) {
    if (headlines.filter((value) => value === headline).length !== 1) {
      fail(`${category} does not contain appendix headline exactly once: ${headline}`)
    }
  }
}

const firstWorld = nonEvents.find((item) => item.category === "World News")
if (!firstWorld || featuredNonEvent.id !== firstWorld.id) {
  fail("featured item is not the first World News item")
}
if (featuredNonEvent.headline !== "Iraq is not invading Poland") {
  fail(`featured headline is ${featuredNonEvent.headline}`)
}

const title = "What Isn’t Happening"
if (title.codePointAt(8) !== 0x2019) {
  fail("site title apostrophe is not U+2019")
}
const sports = appendix.Sports[1] ?? ""
if (sports.codePointAt(27) !== 0x2013) {
  fail("400–0 does not use U+2013")
}

const appSource = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8")
const htmlSource = fs.readFileSync(path.join(root, "index.html"), "utf8")
if (!appSource.includes(title) || !htmlSource.includes(title)) {
  fail("header/hero source or index.html is missing the exact site title")
}
const viteSource = fs.readFileSync(path.join(root, "vite.config.ts"), "utf8")
if (!viteSource.includes("base: '/what-isnt-happening/'")) {
  fail("Vite base is not /what-isnt-happening/")
}
const components = JSON.parse(fs.readFileSync(path.join(root, "components.json"), "utf8")) as {
  style?: string
  tailwind?: { baseColor?: string; cssVariables?: boolean }
}
if (components.style !== "new-york" || components.tailwind?.baseColor !== "zinc" || components.tailwind?.cssVariables !== true) {
  fail("components.json is not New York / Zinc / CSS variables")
}

const dist = path.join(root, "dist")
const htmlPath = path.join(dist, "index.html")
if (!fs.existsSync(htmlPath)) {
  fail("dist/index.html is missing. Run npm run build first.")
} else {
  const html = fs.readFileSync(htmlPath, "utf8")
  if (!html.includes(title)) {
    fail("built HTML title does not include the exact site title")
  }
  const urls = [...html.matchAll(/\s(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1] ?? "")
  if (urls.length === 0) {
    fail("built HTML has no src or href assets")
  }
  for (const url of urls) {
    if (url.startsWith("#") || url.startsWith("data:")) {
      continue
    }
    if (/^[a-z]+:/i.test(url) || url.startsWith("//")) {
      fail(`external or protocol URL in built HTML: ${url}`)
      continue
    }
    if (!url.startsWith(base)) {
      fail(`asset is not base-prefixed: ${url}`)
      continue
    }
    const relative = url.slice(base.length).split("?")[0] ?? ""
    const file = path.join(dist, relative)
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      fail(`base-prefixed asset does not resolve: ${url} -> ${file}`)
    }
  }

  const assetText = fs
    .readdirSync(path.join(dist, "assets"))
    .filter((name) => name.endsWith(".js") || name.endsWith(".css"))
    .map((name) => fs.readFileSync(path.join(dist, "assets", name), "utf8"))
    .join("\n")
  const shipped = `${html}\n${assetText}`
  if (!shipped.includes(title)) {
    fail("built bundle is missing the site title")
  }
  for (const headlines of Object.values(appendix)) {
    for (const headline of headlines) {
      if (!shipped.includes(headline)) {
        fail(`built bundle is missing appendix headline: ${headline}`)
      }
    }
  }
  const external = shipped.match(/https?:\/\/[^\s"'`)]+/g) ?? []
  const inertPrefixes = [
    "https://react.dev/errors/",
    "http://www.w3.org/2000/svg",
    "http://www.w3.org/1998/Math/MathML",
    "http://www.w3.org/1999/xlink",
    "http://www.w3.org/XML/1998/namespace",
    "https://tailwindcss.com",
  ]
  const unexpected = external.filter(
    (url) => !inertPrefixes.some((prefix) => url.startsWith(prefix)),
  )
  if (unexpected.length > 0) {
    fail(`built output contains external URLs: ${unexpected.slice(0, 8).join(", ")}`)
  }
  const cssUrls = [...assetText.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1] ?? "")
  for (const cssUrl of cssUrls) {
    const cleaned = cssUrl.replace(/["']/g, "")
    if (/^https?:\/\//.test(cleaned) || cleaned.startsWith("//")) {
      fail(`CSS loads an external asset: ${cleaned}`)
    }
  }
}

if (failures.length > 0) {
  for (const message of failures) {
    console.error(`FAIL ${message}`)
  }
  console.error(`${failures.length} check(s) failed`)
  process.exit(1)
}

console.log(
  `ok categories=${CATEGORIES.length} items=${nonEvents.length} featured=${JSON.stringify(featuredNonEvent.headline)} ids=${ids.size} confidence=100`,
)
console.log(`ok appendix headlines preserved in order under each category`)
console.log(`ok built HTML and base-prefixed assets under ${base}`)
console.log(
  "note library output contains react.dev/errors strings, w3.org namespace strings, and a Tailwind license comment. None are fetched as content or assets.",
)
