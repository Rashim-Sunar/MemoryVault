# ReverseCalendar Server

TypeScript backend for ReverseCalendar, built with Express, MongoDB (Mongoose), Clerk authentication, and Cloudinary media integration.

## Overview

The server is responsible for:

- authentication-protected API routes
- memory CRUD operations
- upload signature generation for Cloudinary
- dashboard and activity analytics
- favorites and tag-based filtering

## Technology Stack

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- Clerk (`@clerk/clerk-sdk-node`)
- Cloudinary

## Project Structure

```txt
server/
├── src/
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── types/
│   └── utils/
├── dist/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance
- Cloudinary account
- Clerk project configuration

## Installation

```bash
npm install
```

## Environment Variables

Create `.env` in `server/`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLERK_SECRET_KEY=
```

## Available Scripts

```bash
npm run dev        # Build and run in development mode
npm run build      # Compile TypeScript to dist/
npm run start      # Run compiled server (production)
npm run type-check # Validate TypeScript without emit
```

## API Routes

Base path: `/api`

- `GET /sign-upload`
- `POST /media`
- `GET /media`
- `GET /mediaByDates`
- `GET /memorydates`
- `DELETE /media/:id`
- `PATCH /media/:id/favorite`
- `GET /media/favorites`
- `GET /media/by-tag`
- `PATCH /media/:id/tags`
- `GET /media/stats/summary`
- `GET /media/stats/daily`
- `POST /activity/addActivity`
- `GET /activity/getActivities`

All routes are protected by Clerk middleware.

## Notes

- Source of truth is `src/`; do not edit `dist/` manually.
- Use `npm run type-check` before pushing changes.
- Keep response shapes consistent (`{ success, data }`) for frontend compatibility.

## Related Documentation

- Root project overview: `../README.md`
- Migration note: `./TYPESCRIPT_MIGRATION.md`
