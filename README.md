# Busundo - Community Bus Travel Platform

**Tagline:** "Bus Undo? Open Busundo."

## Overview

Busundo is a community-powered bus travel platform designed for students, office workers, and daily commuters in Kerala. Unlike traditional bus apps that only provide schedules and routes, Busundo focuses on helping users coordinate travel with friends, classmates, and other commuters.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes, Server Actions
- **Database:** MongoDB Atlas with Mongoose
- **Authentication:** NextAuth.js (Google OAuth)
- **State Management:** Zustand
- **Real-time:** Socket.IO
- **Maps:** OpenStreetMap with Leaflet
- **Hosting:** Vercel
- **Media:** Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Google OAuth credentials
- Cloudinary account (optional)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.local` and fill in your credentials:
   - MongoDB connection string
   - NextAuth secret (generate with: `openssl rand -base64 32`)
   - Google OAuth credentials
   - Cloudinary credentials (optional)

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
busundo/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── routes/            # Route pages
│   ├── groups/            # Group pages
│   ├── profile/           # Profile pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # UI components (Shadcn)
│   ├── landing/           # Landing page components
│   ├── routes/            # Route components
│   ├── groups/            # Group components
│   └── shared/            # Shared components
├── lib/                   # Utility libraries
│   ├── mongodb/           # MongoDB connection
│   ├── auth/              # Auth configuration
│   ├── socket/            # Socket.IO setup
│   └── utils/             # Utility functions
├── models/                # Mongoose models
├── actions/               # Server actions
├── services/              # Business logic
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
├── types/                 # TypeScript types
└── constants/             # App constants
```

## MVP Features

- ✅ Google Authentication
- ✅ Route Search
- ✅ Travel Groups
- ✅ Join Bus
- ✅ Travel Status Updates
- ✅ Notifications
- ✅ Share Routes

## Phase 2 Features (Coming Soon)

- Group Chat
- Friend Coordination
- Bus Delay Reports
- College Communities
- Favorite Routes

## Phase 3 Features (Future)

- Live Crowd Tracking
- AI Route Recommendations
- Smart Travel Suggestions

## Development Roadmap

- **Week 1:** Project setup, MongoDB, NextAuth, design system
- **Week 2:** Authentication, user profiles, landing page
- **Week 3:** Route search and details
- **Week 4:** Travel groups and join functionality
- **Week 5:** Notifications and sharing
- **Week 6:** Testing, bug fixes, deployment

## Contributing

This is a private project for Kerala students. Contributions are welcome!

## License

All rights reserved © 2024 Busundo

---

Made with ❤️ for Kerala students
