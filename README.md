# Spatial Movie Finder

An interactive WebGL "movie universe" 2,000 films rendered as a single
instanced draw call, force-clustered by genre with [d3-force](https://d3js.org/d3-force),
and navigable by pan/zoom instead of infinite scroll. Click a poster and it
morphs, canvas-to-DOM, into a full detail panel.

Built with React, [Three.js](https://threejs.org/) via
[`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber), Tailwind CSS,
and hand-rolled [shadcn/ui](https://ui.shadcn.com)-style components.

## What it demonstrates

- **Math/geometry in the UI** — a d3-force simulation pulls each film toward
  its genre's cluster center while charge/collision forces pack the cluster
  into an organic blob, run once on load rather than every frame.
- **High-performance rendering** — the entire universe is one
  `THREE.InstancedMesh` (one draw call, one shared texture, per-instance
  color and transform), with an ambient per-frame bob applied via direct
  instance-matrix writes. It holds 60fps on real GPUs for thousands of nodes
  (this repo ships with 2,000; the `MOVIE_COUNT` constant in `src/App.tsx`
  can be raised).
- **Canvas-to-DOM interaction** — clicking a poster projects its exact
  on-screen rect from the orthographic camera and grows a `framer-motion`
  panel out of that rect into a standard HTML detail view.

All movie data is procedurally generated (`src/lib/mockMovies.ts`) with a
seeded RNG, so the universe is stable across reloads — there's no backend or
API key required.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Other scripts:

```bash
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## Controls

- **Drag** to pan, **scroll/pinch** to zoom.
- **Hover** a poster for a quick title/genre/year tooltip.
- **Click** a poster to open its detail panel.
- Use the **genre chips** (top right) to isolate or toggle genres, and the
  **search box** (top left) to filter by title or director.

## Project structure

```
src/
  components/
    scene/      # the WebGL layer: instanced posters, halos, atmosphere
    overlay/     # DOM UI: search, legend, stats, the morph detail panel
    ui/          # shadcn/ui-style primitives (button, badge, input, sheet…)
  lib/
    mockMovies.ts   # seeded synthetic dataset generator
    layout.ts       # d3-force genre clustering
    genres.ts        # fixed categorical palette (8 genres)
    textures.ts      # procedural canvas textures (poster mask, glow)
    projection.ts    # world → screen-space rect for the morph animation
```

## Deploying

### Push to GitHub

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

(This repo has already been initialized with git and an initial commit —
you just need to add your remote and push.)

### Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo
   you just pushed.
2. Vercel auto-detects Vite via the included `vercel.json` — no
   environment variables or extra config needed. Click **Deploy**.

Or from the CLI:

```bash
npm i -g vercel
vercel
```

## Notes & known trade-offs

- Posters are procedural colored cards (a shared alpha-masked texture tinted
  per-instance), not real artwork — this keeps the whole scene to a single
  draw call. Swapping in real poster textures would mean either a texture
  atlas or per-genre instanced meshes with shared maps.
- The genre palette is capped at 8 colors, chosen from a CVD-safe categorical
  order rather than a larger arbitrary rainbow, so clusters stay visually
  distinguishable — genre is always also shown as text on hover/click, never
  color-only.
- Raycasting for hover/click runs against all instances on pointer move; fine
  at this scale, but a spatial index (quadtree) would be the next step if you
  push node counts much higher.
