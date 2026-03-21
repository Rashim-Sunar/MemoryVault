# MemoryVault

MemoryVault is a full-stack MERN app for storing and revisiting memories using a calendar-first experience.

## Overview

Core capabilities:
- Calendar-based memory browsing
- Upload photos/videos with notes and tags
- Favorites and activity feed
- Dashboard stats and timeline chart
- Secure auth via Clerk

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose)
- Media: Cloudinary
- Auth: Clerk

## Features

### Calendar-Based Memory System
- Interactive calendar UI
- Click on dates to fetch memories
- Organized timeline-based experience

### Memory Management
- Upload memories with:<ul> <li>Title</li><li>Description (memory text)</li> <li>Tags</li><li>Photos & Videos</li></ul>
- Media stored securely in Cloudinary

### Search & Filtering
- Search memories using tags
- Retrieve memories by specific dates
  
### Pagination System
- Efficient loading of memories
- Optimized for scalability and performance

### Dashboard Analytics

- Monthly insights: <ul> <li>Total memories</li><li>Number of photos</li> <li>Number of videos</li></ul>

- Bar chart visualization of memory activity

### Favorites System
- Add/remove memories to favorites
- Quick access to important moments

### Smart Features
- Get random memory (nostalgic recall)
- Activity tracking (history of actions)

### Authentication
- Secure authentication powered by Clerk

## Project Structure

```txt
ReverseCalender/
├── client/                 # React app (TypeScript)
├── server/                 # Express backend
│   └── README.md           # Server documentation
└── README.md               # Main project documentation
```

## Server Documentation

Server documentation is maintained in:
- `server/README.md`
- `server/TYPESCRIPT_MIGRATION.md`

## ⚙️ Installation & Setup

### 1. Clone Repository
```
git clone https://github.com/Rashim-Sunar/MemoryVault.git
cd MemoryVault
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

## Run

### 1. Start backend
```bash
cd server
npm run dev
```

### 2. Start frontend
```bash
cd client
npm run dev
```

## Environment Variables

Server `.env`:

```env
MONGO_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLERK_SECRET_KEY=
CLIENT_URL=
```

Client `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=
```

 ## Future Improvements
- Memory sharing with other users
- AI-based tagging and recommendations
- Location-based memory mapping
- Progressive Web App (PWA) support
- Offline memory access

## 🤝 Contributing

1. Fork the repository
2. Create a branch (feature/new-feature)
3. Commit your changes
4. Open a pull request

## 👨‍💻 Author
Rashim Sunar <br/>
MERN Stack Developer