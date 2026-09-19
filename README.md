# Akshay Chandra — Portfolio

A modern React/Vite portfolio for Akshay Chandra, focused on Data Science, AI/ML, software projects and research.

## Stack

- React + Vite
- Tailwind CSS
- Custom CSS for glassmorphism, depth and motion
- Node.js + Express
- Helmet + compression
- Lucide React
- Portfolio assistant API

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

The assistant endpoint is provider-neutral and can be connected to an LLM later without changing the UI.
