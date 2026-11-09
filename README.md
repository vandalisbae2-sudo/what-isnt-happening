# What Isn’t Happening

Fictional entertainment dashboard. It reports invented non-events. It is not news, a market feed, or financial information.

Release is pending. No repository owner, GitHub Pages site, or live URL is assigned here. Publisher acts only after an independent Reviewer pass and Martin’s second approval.

## Commands

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`npm run dev` serves the dashboard at <http://127.0.0.1:4179/what-isnt-happening/>.

`npm run preview` serves the production build at <http://127.0.0.1:4181/what-isnt-happening/>.

Both use the Vite base path `/what-isnt-happening/`.

After a build, check the dataset and the built files:

```bash
node --experimental-strip-types scripts/verify-build.ts
```

## Structure

- `src/data/isnt-happening.ts` — ordered categories and the only non-event dataset
- `src/App.tsx` — header, hero, nine category grids, footer ticker
- `src/components/ui/` — shadcn/ui New York card, badge, separator, and scroll-area
- `src/index.css` — Tailwind and Zinc CSS variables
- `components.json` — New York style, Zinc base color, CSS variables
- `.github/workflows/deploy.yml` — GitHub Pages workflow, written only, not run
- `scripts/verify-build.ts` — local dataset and base-path checks
- `build-checks/` — captured install, build, and verification output

## Release

Not published. The workflow file is present for a later Publisher. This draft does not enable GitHub Pages and does not deploy.

## Limits

`npm run build` typechecks and bundles. `scripts/verify-build.ts` checks category counts, ids, confidence, verbatim appendix headlines, and that built asset URLs sit under `/what-isnt-happening/` and resolve on disk. `build-checks/` keeps the command logs and a headless layout measurement. None of that is a final QA pass. Reviewer still compares the built site with the approved brief.
