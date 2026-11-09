# Build and verification notes

This is implementation evidence for Reviewer. It is not a final QA pass and it does not authorize publication.

## What was built

One static dashboard at `/what-isnt-happening/`. Header and hero use the exact title What Isn’t Happening (U+2019). The hero shows a live viewer-local clock labeled “Viewer local time”, with the device timezone and the line “Live clock on this device. Not a newsroom wire.” The featured card is the first World News item, “Iraq is not invading Poland”, and that item is also the first card in World News. Nine categories follow the brief order, eight entries each, 72 total. Appendix headlines are first in each category, verbatim. The other 45 entries are same-premise expansions and are the only items with a detail line. Every card shows `Confidence: 100%`. The footer ticker reuses the same 72 headlines. Reduced motion replaces the animation with a horizontal scroll area. The page states that it is fictional entertainment, not news or finance.

Stack: Vite, React, TypeScript strict, Tailwind CSS, shadcn/ui New York components (card, badge, separator, scroll-area), Zinc CSS variables in `src/index.css`, `@/` in `tsconfig.app.json` paths and in `vite.config.ts`. `components.json` records style `new-york`, base color `zinc`, and `cssVariables: true`. No external fonts, feeds, or content assets. The favicon is a local SVG.

The current shadcn CLI’s default preset is no longer New York. Components were written from the New York source shape (Radix separator, scroll area, and slot; `cva` badge; card slots) instead of continuing preset exploration. `ScrollArea` takes an `orientation` prop so the Radix scrollbar stays a sibling of the viewport.

## Commands

Node v22.23.4, npm 10.9.9. Exact logs are the sibling files in this directory. Empty stderr files mean the command wrote nothing to stderr.

| Command | Exit | Log |
| --- | --- | --- |
| `npm install` (initial Vite scaffold) | 0 | `npm-install.*` |
| `npm install` of Tailwind, then UI primitives (`clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`, `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`) | 0 | Tailwind install was not separately logged. Primitive install: `npm-install-primitives.*` |
| `npm ci` | 0 | `npm-ci.*` |
| `npm run build` before removing `baseUrl` | 1 | `npm-run-build-ts5102.*` |
| `npm run build` after that fix | 0 | `npm-run-build.*` |
| `node --experimental-strip-types scripts/verify-build.ts` while it still flagged library strings | 1 | `verify-build-external-strings.*` |
| same command after the check ignored inert library strings | 0 | `verify-build.*` |

`npm ci` stdout:

```
added 63 packages, and audited 70 packages in 1s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

stderr empty. Exit 0.

First `npm run build` stdout (exit 1, stderr empty):

```
> what-isnt-happening@0.0.0 build
> tsc -b && vite build

tsconfig.app.json(11,5): error TS5102: Option 'baseUrl' has been removed. Please remove it from your configuration.
  Use '"paths": {"*": ["./*"]}' instead.
```

TypeScript 7 rejects `baseUrl`. It was removed. `@/*` stays in `paths`, and Vite resolves the same alias. The successful build is the one below.

Successful `npm run build` stdout (exit 0, stderr empty):

```
> what-isnt-happening@0.0.0 build
> tsc -b && vite build

vite v8.3.6 building client environment for production...
transforming...
✓ 38 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.69 kB │ gzip:  0.40 kB
dist/assets/index-X5_ChFeJ.css   17.57 kB │ gzip:  4.47 kB
dist/assets/index-DOCnZ7mo.js   288.93 kB │ gzip: 90.98 kB

✓ built in 159ms
```

`tsc -b` produced no type errors on that run. Vite then bundled.

Successful verify stdout (exit 0, stderr empty):

```
ok categories=9 items=72 featured="Iraq is not invading Poland" ids=72 confidence=100
ok appendix headlines preserved in order under each category
ok built HTML and base-prefixed assets under /what-isnt-happening/
note library output contains react.dev/errors strings, w3.org namespace strings, and a Tailwind license comment. None are fetched as content or assets.
```

## Content and base-path checks

`scripts/verify-build.ts` imports the dataset and checks:

- category order matches the brief
- each category has 8 items, 72 total
- ids are unique
- every confidence value is 100
- the appendix headlines are the first items in each category, verbatim, including the en dash in `400–0` (U+2013)
- the featured item is the first World News item
- `index.html` and `src/App.tsx` contain the exact title
- Vite `base` is `/what-isnt-happening/`
- `components.json` is New York / Zinc / CSS variables
- `dist/index.html` exists and its `src` and `href` values are base-prefixed and resolve to files under `dist/`
- the built JS contains every appendix headline
- remote `http(s)` strings in the bundle are only inert library text: React error-decoder URLs, XML namespace URLs inside Radix, and the Tailwind license comment `https://tailwindcss.com`. CSS `url()` loads no remote asset.

Built HTML references:

- `/what-isnt-happening/favicon.svg`
- `/what-isnt-happening/assets/index-DOCnZ7mo.js`
- `/what-isnt-happening/assets/index-X5_ChFeJ.css`

There is no second page and no cross-document link. The only in-app link is the skip link to `#dashboard`.

## Layout measurement

Headless Chrome opened the preview build at `http://127.0.0.1:4181/what-isnt-happening/`. This is recorded in `layout-check.json`. It is not a Reviewer pass.

| Viewport | scrollWidth − clientWidth | Cards | Confidence badges | Detail lines |
| --- | --- | --- | --- | --- |
| 390×844 | 0 | 73 (1 featured + 72) | 73 | 45 |
| 768×1024 | 0 | 73 | 73 | 45 |
| 1440×900 (client width 1425 with scrollbar) | 0 | 73 | 73 | 45 |

Headings were in brief order. With `prefers-reduced-motion: reduce`, the animated ticker was absent and the horizontal scroll area was present. Hero screenshots taken a second apart show the clock seconds changing (6:09:43, 6:09:44, 6:09:45). The environment zone was UTC, which is the local zone of that browser.

## How Reviewer can run it

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:4179/what-isnt-happening/`.

```bash
npm run build
npm run preview
node --experimental-strip-types scripts/verify-build.ts
```

Preview is `http://127.0.0.1:4181/what-isnt-happening/`. Dev listens on 4179 and preview on 4181, host `0.0.0.0`. Both require the `/what-isnt-happening/` base path.

## Release gate

`.github/workflows/deploy.yml` is written only. It was not run, dispatched, or enabled. No GitHub repository was created, no Pages site was turned on, and no live URL is claimed. Publisher waits for an independent Reviewer pass and Martin’s second approval.

## Open items

- Reviewer still needs to compare the built page with the approved brief and return a pass or corrections.
- Repository owner and any live Pages URL are unset on purpose.
- Screenshot and overflow checks were headless, at three widths, on the production preview. They do not replace Reviewer.
- The 45 non-appendix headlines and their details were written for this implementation. They are not in the brief’s appendix.
