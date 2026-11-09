// Ordered category registry and the only non-event dataset.
// Appendix headlines are copied verbatim. Later headlines in each category
// are expansions in the same premise.

export const CATEGORIES = [
  "World News",
  "Stock Market",
  "Personal Finance",
  "Weather",
  "Sports",
  "Science & Tech",
  "Celebrity",
  "Local",
  "Personal Life",
] as const

export type Category = (typeof CATEGORIES)[number]

export type NonEventConfidence = 100

export type NonEvent = {
  id: string
  category: Category
  headline: string
  detail?: string
  confidence: NonEventConfidence
}

const idPrefix: Record<Category, string> = {
  "World News": "world-news",
  "Stock Market": "stock-market",
  "Personal Finance": "personal-finance",
  Weather: "weather",
  Sports: "sports",
  "Science & Tech": "science-tech",
  Celebrity: "celebrity",
  Local: "local",
  "Personal Life": "personal-life",
}

function entry(
  category: Category,
  number: number,
  headline: string,
  detail?: string,
): NonEvent {
  const item: NonEvent = {
    id: `${idPrefix[category]}-${String(number).padStart(2, "0")}`,
    category,
    headline,
    confidence: 100,
  }
  if (detail) {
    item.detail = detail
  }
  return item
}

export const nonEvents: readonly NonEvent[] = [
  entry("World News", 1, "Iraq is not invading Poland"),
  entry("World News", 2, "France has not declared war on the concept of breakfast"),
  entry(
    "World News",
    3,
    "The United Nations is not currently voting on whether the moon should pay rent",
  ),
  entry("World News", 4, "Antarctica is not applying for statehood"),
  entry(
    "World News",
    5,
    "Belgium is not quietly relocating three kilometers to the left",
    "Surveyors compared the maps. Belgium is still where it was.",
  ),
  entry(
    "World News",
    6,
    "The International Date Line is not being rented out for weddings",
    "No venue has accepted a deposit, and Tuesday still follows Monday.",
  ),
  entry(
    "World News",
    7,
    "Norway has not declared the northern lights a protected employee",
    "The lights continue without wages, hours, or a supervisor.",
  ),
  entry(
    "World News",
    8,
    "New Zealand is not upstream of the rest of the map",
    "Water there still runs toward the sea, which has not taken a new address.",
  ),

  entry(
    "Stock Market",
    1,
    "The Dow is not up 14,000 points because of a rumor about free money",
  ),
  entry(
    "Stock Market",
    2,
    "Apple stock is not being controlled by a single particularly ambitious squirrel",
  ),
  entry("Stock Market", 3, "Bitcoin is not worth exactly one potato right now"),
  entry(
    "Stock Market",
    4,
    "The S&P 500 is not denominated in loose change and goodwill",
    "The index is still quoted in its usual currency.",
  ),
  entry(
    "Stock Market",
    5,
    "A goose has not been named interim chair of the Federal Reserve",
    "No waterfowl appears in the minutes.",
  ),
  entry(
    "Stock Market",
    6,
    "Gold is not trading sideways out of personal spite",
    "Any lack of movement is not personal.",
  ),
  entry(
    "Stock Market",
    7,
    "The Nasdaq is not closed for a mandatory nap",
    "The closing bell has not been replaced with a lullaby.",
  ),
  entry(
    "Stock Market",
    8,
    "Shares in ordinary gravity are not down on light volume",
    "Objects continue to fall, and none of them have a ticker.",
  ),

  entry("Personal Finance", 1, "Your credit card balance is not $0.00"),
  entry("Personal Finance", 2, "Your credit card balance is not negative $47,000"),
  entry(
    "Personal Finance",
    3,
    "The bank is not sending you a handwritten apology for existing",
  ),
  entry(
    "Personal Finance",
    4,
    "Your savings account is not compounding out of embarrassment",
    "Interest, where it exists, is not an apology.",
  ),
  entry(
    "Personal Finance",
    5,
    "A modest castle has not been direct-deposited into your checking account",
    "The available balance does not include towers or a moat.",
  ),
  entry(
    "Personal Finance",
    6,
    "Your mortgage is not paying you rent",
    "The house has not become the tenant.",
  ),
  entry(
    "Personal Finance",
    7,
    "The ATM is not applauding your life choices",
    "It offers the usual silence and, on request, cash.",
  ),
  entry(
    "Personal Finance",
    8,
    "Your budget is not filing itself under folklore",
    "The spreadsheet is still a spreadsheet.",
  ),

  entry("Weather", 1, "It is not raining frogs in Chicago"),
  entry("Weather", 2, "There is not a 100% chance of meatballs in Seattle"),
  entry(
    "Weather",
    3,
    "There is currently no Category 5 hurricane made entirely of glitter",
  ),
  entry(
    "Weather",
    4,
    "It is not snowing warm soup in Minneapolis",
    "No ladle advisory has been issued.",
  ),
  entry(
    "Weather",
    5,
    "There is not a drizzle of paperwork over Denver",
    "Forms are not falling from the sky.",
  ),
  entry(
    "Weather",
    6,
    "Phoenix is not experiencing a brief, localized glacier",
    "The pavement has not been asked to remember an ice age.",
  ),
  entry(
    "Weather",
    7,
    "The humidity in Miami is not eligible to vote",
    "It remains weather, which does not receive a ballot.",
  ),
  entry(
    "Weather",
    8,
    "The wind in Boston is not carrying small, courteous thunderstorms",
    "Any storms in the area have not sent a note ahead.",
  ),

  entry("Sports", 1, "The Super Bowl is not being played underwater this year"),
  entry("Sports", 2, "No team is currently up 400–0"),
  entry("Sports", 3, "Your fantasy football team is not winning"),
  entry(
    "Sports",
    4,
    "The World Series is not being decided by a coin toss in another sport",
    "No second sport has been invited to finish the job.",
  ),
  entry(
    "Sports",
    5,
    "No marathon is being won by a person who stayed home",
    "The finish line has not come to the couch.",
  ),
  entry(
    "Sports",
    6,
    "The Olympic flame is not a scented candle",
    "It has not been replaced with vanilla or cedar.",
  ),
  entry(
    "Sports",
    7,
    "A referee has not ejected the concept of time",
    "The clock remains in the game.",
  ),
  entry(
    "Sports",
    8,
    "The championship parade is not set for a date that does not exist",
    "No route has been filed for a day the calendar does not have.",
  ),

  entry(
    "Science & Tech",
    1,
    "Scientists have not discovered that the Earth is actually flat but only on Tuesdays",
  ),
  entry(
    "Science & Tech",
    2,
    "AI has not achieved sentience and immediately asked for a raise",
  ),
  entry("Science & Tech", 3, "Your phone battery is not at 100%"),
  entry(
    "Science & Tech",
    4,
    "Physicists have not found that left is occasionally up",
    "Directions remain where they were, including left.",
  ),
  entry(
    "Science & Tech",
    5,
    "Your laptop has not unionized with the printer",
    "Neither machine has demanded new hours.",
  ),
  entry(
    "Science & Tech",
    6,
    "The satellites are not taking a personal day",
    "They continue overhead without calling in.",
  ),
  entry(
    "Science & Tech",
    7,
    "No robot has been granted tenure in a subject it named this morning",
    "The committee has not met, and the subject has no name on file.",
  ),
  entry(
    "Science & Tech",
    8,
    "The internet is not buffering the afternoon",
    "The afternoon is not waiting on a spinning icon.",
  ),

  entry(
    "Celebrity",
    1,
    "Taylor Swift is not releasing an album called Actually, Never Mind",
  ),
  entry(
    "Celebrity",
    2,
    "No major actor has announced they are leaving Hollywood to become a lighthouse keeper",
  ),
  entry(
    "Celebrity",
    3,
    "No pop star has legally changed their name to Intermission",
    "The paperwork was not filed.",
  ),
  entry(
    "Celebrity",
    4,
    "No film festival is awarding Best Picture to a closed curtain",
    "The curtain is not a nominee.",
  ),
  entry(
    "Celebrity",
    5,
    "The red carpet is not on strike over the lighting",
    "It remains a carpet, and it has not issued demands.",
  ),
  entry(
    "Celebrity",
    6,
    "A late-night host is not interviewing an empty chair and agreeing with it",
    "The chair was not booked.",
  ),
  entry(
    "Celebrity",
    7,
    "No celebrity chef is opening a restaurant that serves only the idea of dinner",
    "Reservations are not open for a concept in place of a meal.",
  ),
  entry(
    "Celebrity",
    8,
    "A boy band has not reunited to announce that it is not reuniting",
    "No stage has been reserved for the announcement.",
  ),

  entry("Local", 1, "There is not a parade outside your window right now"),
  entry("Local", 2, "Your neighbor is not building a rocket in their backyard"),
  entry("Local", 3, "There is not a free pizza truck parked on your street"),
  entry(
    "Local",
    4,
    "City hall is not issuing permits for weather",
    "Rain, if it comes, will not have filled out a form.",
  ),
  entry(
    "Local",
    5,
    "The crosswalk signal is not giving legal advice",
    "It still signals walk or don't walk, and neither one is counsel.",
  ),
  entry(
    "Local",
    6,
    "Your street has not been renamed for a weekday",
    "The sign is unchanged, and Thursday has not taken the name.",
  ),
  entry(
    "Local",
    7,
    "The library is not lending out modest victories",
    "The shelves hold books. Small wins are not among them.",
  ),
  entry(
    "Local",
    8,
    "Parking enforcement is not ticketing clouds",
    "The sky is not a loading zone.",
  ),

  entry("Personal Life", 1, "You are not late to something important"),
  entry("Personal Life", 2, "Your plants are not plotting against you"),
  entry("Personal Life", 3, "You did not accidentally reply-all to the entire company"),
  entry(
    "Personal Life",
    4,
    "Your keys are not in the first place you look",
    "They have not volunteered a location.",
  ),
  entry(
    "Personal Life",
    5,
    "You have not already sent the email you are still writing",
    "The draft is still a draft.",
  ),
  entry(
    "Personal Life",
    6,
    "The group chat is not proud of you in particular",
    "No message to that effect is waiting.",
  ),
  entry(
    "Personal Life",
    7,
    "Your calendar is not empty because things went well",
    "The open hours are not a prize.",
  ),
  entry(
    "Personal Life",
    8,
    "You are not early to something that does not matter",
    "Punctuality has not broken out in the wrong direction.",
  ),
]

function firstWorldNews(items: readonly NonEvent[]): NonEvent {
  const found = items.find((item) => item.category === "World News")
  if (!found) {
    throw new Error("World News has no entries.")
  }
  return found
}

export const featuredNonEvent: NonEvent = firstWorldNews(nonEvents)

export function itemsForCategory(category: Category): readonly NonEvent[] {
  return nonEvents.filter((item) => item.category === category)
}
