# Akshay Chandra — Portfolio

Modern React portfolio with a Node.js/Express backend.

## Stack

- React + Vite
- Tailwind CSS
- Node.js + Express
- Helmet + compression
- Lucide React
- Responsive glassmorphism UI
- Local portfolio assistant API

## Run locally

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:3000

## Production

```bash
npm run build
npm start
```

The Express server serves the Vite production build and exposes:

- GET /api/health
- GET /api/profile
- POST /api/chat

The assistant API is intentionally provider-neutral, so an LLM provider can be connected later without changing the UI.
