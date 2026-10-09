# New Dharani Hospitals

Static, responsive hospital website.

## Run locally

```powershell
npm run dev
```

Open the URL printed in the terminal. The server tries the next available port if port 5173 is already in use.

The site can also be opened directly from `index.html`.

## Deploy

This is a static site with `index.html` at the project root. Import the repository into Vercel and use the default static-site settings (no build command; output directory `.`).

Doctor portraits that are not yet available are represented by monograms. Add a portrait under `images/` and update its doctor card in `index.html` when ready.
