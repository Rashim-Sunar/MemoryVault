# MemoryVault

A modern full-stack MERN application (MongoDB, Express, React, Node.js) built with TypeScript, designed to help users store, organize, and relive memories through an intuitive calendar-based interface.

The platform supports media-rich memories (photos, videos, text) with advanced features like tag search, analytics dashboard, favorites, and activity tracking.

## Project Overview
Memory Vault provides a structured way to capture life moments and revisit them effortlessly:

- Calendar-based memory retrieval
- Media storage (Cloudinary integration)
- Tag-based search & filtering
- Insights via dashboard analytics
- Favorites & activity tracking

Real-world use case: personal journaling apps, travel memory logs, digital scrapbooks, or social memory platforms.

## Architecture Overview
This project follows a client-server architecture with clear separation between frontend and backend.

### Components
| Layer                             | Responsibility                                           |
| --------------------------------- | -------------------------------------------------------- |
| **Frontend (React + TS)**         | UI, calendar interactions, dashboard visualization       |
| **Backend (Node + Express + TS)** | API handling, business logic, authentication             |
| **Database (MongoDB)**            | Stores memory metadata (title, description, tags, links) |
| **Cloud Storage (Cloudinary)**    | Stores images and videos                                 |


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
  
## Tech Stack
### Frontend
- React (TypeScript)
- Tailwind CSS
- Calendar UI libraries
- Chart libraries (for analytics)

### Backend
- Node.js
- Express.js (TypeScript)
- MongoDB (Mongoose)

### Services & Tools
- Cloudinary (media storage)
- Clerk (authentication)
- REST APIs

## 📁 Folder Structure
```
MemoryVault/
│
├── frontend/              # React + TypeScript + Tailwind
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
|   ├── store/
│   └── types/   
│
├── backend/               # Express + TypeScript API
│   ├── controllers/
│   ├── routes/
│   ├── model/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
└── README.md
```

## ⚙️ Installation & Setup

### 1) Clone Repository
```
git clone https://github.com/Rashim-Sunar/MemoryVault.git
cd MemoryVault
```

## 2) Install Dependencies
 ### Backend
 ```
  cd server
  npm install
 ```

 ### Frontend
 ```
 cd client
 npm install
 ```

 ## Running the Application
 ### Start Backend
 ```
 cd server
 node app.js
```

### Start Frontend
```
cd client
npm run dev
```

 ## Environment Variables
Both frontend and backend require .env configuration.
 ### Server
 .env
 ```
 MONGO_URI=
 CLOUDINARY_CLOUD_NAME=
 CLOUDINARY_API_KEY=
 CLOUDINARY_API_SECRET=
 CLERK_SECRET_KEY=
 CLIENT_URL=
 ```

 ### Frontend 
 .env
 ```
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