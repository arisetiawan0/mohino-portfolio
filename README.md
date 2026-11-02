# mohino-portfolio

Personal portfolio of Ari Setiawan, developer and digital marketer. Live at [mohino.web.id](https://mohino.web.id).

The hero is a receipt-printer simulator: type or tap a command (`projects`, `skill`, `contact`) and the answer prints as a thermal receipt, with a customer display, stamps, and a barcode. All answers are scripted, so there is no backend and no LLM call. Everything in the simulator is also available as regular page sections, rendered on the server.

## Stack

- Next.js (App Router, static export), React, TypeScript, Tailwind CSS
- Indonesian (`/`) and English (`/en`), with role modes via `?peran=dev|ai|marketing`
- Open Graph images rendered at build time with `next/og`
- Deployed as an assets-only Cloudflare Worker (`wrangler.jsonc`)

## Scripts

```bash
npm run dev        # local development
npm run build      # static export to out/
npm run cf:dev     # build, then serve out/ with wrangler dev
npm run deploy     # build, then wrangler deploy
```

Content lives in `content/` (projects, skills, timeline, and the ID/EN dictionaries). The CV PDF is printed from `cv-builder/cv.html` with `python3 cv-builder/build.py`.
