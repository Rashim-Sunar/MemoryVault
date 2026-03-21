# ReverseCalendar Client

Frontend application for ReverseCalendar, built with React, TypeScript, and Vite.

## Overview

The client provides the user interface for:

- authentication and session-aware routing
- memory upload and media display
- calendar-based memory retrieval
- dashboard analytics and activity feed
- favorites and tag-based discovery

This project is designed to work with the backend in `../server`.

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Clerk (authentication)
- Zustand and Context API (state management)
- Chart.js and Recharts (visualization)

## Project Structure

```txt
client/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   ├── types/
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in `client/` and configure:

```env
VITE_CLERK_PUBLISHABLE_KEY=
```

If your API base URL is configured in code, ensure it points to the running backend (typically `http://localhost:5000`).

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Type-check and create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Development Workflow

1. Start backend from `server/`.
2. Start frontend from `client/` using `npm run dev`.
3. Open the local Vite URL shown in terminal (default: `http://localhost:5173`).

## Build Notes

- TypeScript is configured with `noEmit: true` to prevent generated JavaScript files from being written into `src/`.
- Production assets are output to `client/dist/`.

## Troubleshooting

- If charts fail to compile, verify dependencies are installed (`recharts`, `chart.js`, `react-chartjs-2`).
- If authenticated API requests fail, confirm Clerk keys and backend auth configuration.
- If stale modules are served, stop dev server and restart after clearing Vite cache.

## Related Documentation

- Root project documentation: `../README.md`
- Backend documentation: `../server/README.md`
