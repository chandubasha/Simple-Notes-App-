# Simple Notes (Next.js + MongoDB + Tailwind)

A minimal notes app where you can **create, list, edit, delete, and search** notes.
Includes **basic validation** (title required) and **dark mode**.

## Tech
- Next.js 14 (App Router, Route Handlers)
- MongoDB via Mongoose
- Tailwind CSS
- Dark mode (class-based)

## Quick Start (Local)
1. **Install**: `npm install`
2. **Copy env**: `cp .env.example .env` and set `MONGODB_URI` (use MongoDB Atlas).
3. **Run**: `npm run dev`
4. Open `http://localhost:3000`

## Deploy on Vercel
1. Push this repo to GitHub.
2. Import the repo on Vercel.
3. Add **Environment Variable** `MONGODB_URI` (same value as local).
4. Deploy. (Build command: `next build`, Output: `.next` – default settings are fine.)

## Key Decisions
- **App Router + Route Handlers** to keep CRUD simple without extra API server.
- **Mongoose** for a clean schema + quick validation.
- **Client-side fetch** to keep code straightforward and fast to implement.
- **Tailwind** for quick, responsive UI.
- **Dark mode** with a small toggle + `class` strategy, no dependency on OS.

## Folder Structure
```
app/
  api/
    notes/
      [id]/route.ts   # PUT, DELETE
      route.ts        # GET, POST
  globals.css
  layout.tsx
  page.tsx
lib/
  mongodb.ts
models/
  Note.ts
.env.example
package.json
tailwind.config.ts
postcss.config.js
tsconfig.json
next.config.mjs
```

## Notes
- Basic validation ensures **title** is required on create/update.
- Search is **client-side** (title/content).
- Responsive layout via Tailwind defaults.
