# Frontend (React + Vite) — 2D Graphics Demo

This folder contains a minimal React + Vite application that demonstrates 2D graphics using an HTML5 Canvas.

Quick start (PowerShell):

```powershell
cd "C:\Users\pitca\OneDrive\Desktop\My Sample Projects\Github Small Projects\New\frontend"
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

Files of interest:
- `src/components/Canvas2D.jsx` — animated canvas demo
- `src/App.jsx` — app shell

## Deploying on Vercel

This repository includes a `vercel.json` at the repository root configured to build the `frontend` folder as a static site using the `@vercel/static-build` builder.

To deploy from the repo root using Vercel:

1. In the Vercel dashboard, create a new project and import this Git repository.
2. If Vercel doesn't auto-detect the frontend folder, the included `vercel.json` tells Vercel to use `frontend/package.json` for the build. The build command will run `npm run vercel-build` (or `npm run build`) and output to `dist`.

Manual deploy (PowerShell):

```powershell
cd "C:\Users\pitca\OneDrive\Desktop\My Sample Projects\Github Small Projects\New"
vercel --prod
```

Or deploy only the frontend folder:

```powershell
cd "C:\Users\pitca\OneDrive\Desktop\My Sample Projects\Github Small Projects\New\frontend"
vercel --prod
```

Note: Ensure you have the Vercel CLI installed and are logged in (`npm i -g vercel`).
