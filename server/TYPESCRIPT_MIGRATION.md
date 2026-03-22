# TypeScript Migration Notes

The backend has been migrated from JavaScript to TypeScript.

## Current Source of Truth
- Source code: `server/src/**/*.ts`
- Build output: `server/dist/`

## Commands
- `npm run dev` - Build and run in development mode
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Run compiled app from `dist/app.js`
- `npm run type-check` - Validate TypeScript types without emitting files

## Environment
Use `.env` (see `.env.example`) and define:
- `MONGO_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL`
- `PORT`
