# 🗄️ BusUndo Database Setup

## ✅ MongoDB Connection Established!

### **Connection Details**
- **Database:** BusUndo
- **Connection String:** `mongodb+srv://brototypeTest:vcbodheesh@clusterfortest.yvsxay2.mongodb.net/BusUndo`
- **Status:** ✅ Connected

---

## 📁 Files Created

### **1. Database Connection** (`lib/mongodb.ts`)
- Singleton MongoDB client
- Development mode caching
- Production-ready connection pooling
- Helper function to get database instance

### **2. Database Models** (`lib/models.ts`)
- **Collections:**
  - `users` - User accounts and preferences
  - `routes` - Bus routes with stops
  - `groups` - Travel groups
  - `groupMembers` - Group membership and status
  - `notifications` - User notifications

- **Helper Functions:**
  - User CRUD operations
  - Route search and retrieval
  - Group management
  - Member status updates
  - Notification handling

### **3. Test API Route** (`app/api/test-db/route.ts`)
- Test database connection
- List all collections
- Verify connectivity

### **4. Seed Script** (`scripts/seed-routes.ts`)
- Populate database with sample routes
- Clear and reset data
- Run with: `npm run seed`

---

## 🚀 Quick Start

### **1. Test Database Connection**

Visit: http://localhost:3001/api/test-db

You should see:
```json
{
  "success": true,
  "message": "Database connected successfully!",
  "database": "BusUndo",
  "collections": [...],
  "timestamp": "2026-06-14T..."
}
```

### **2. Seed Sample Routes**

```bash
npm run seed
```

This will:
- Clear existing routes
- Insert 4 sample routes:
  - Aluva → Kakkanad (2 routes)
  - Ernakulam → Kochi
  - Thrissur → Ernakulam
- Display inserted routes

---

## 📊 Database Schema

### **Users Collection**
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  image?: string,
  college?: string,
  city?: string,
  favoriteRoutes?: ObjectId[],
  notifications?: {
    groupUpdates: boolean,
    newGroups: boolean,
    reminders: boolean,
  },
  createdAt: Date,
  updatedAt: Date,
}
```

### **Routes Collection**
```typescript
{
  _id: ObjectId,
  code: string,              // e.g., "KL-07 / 412"
  source: string,            // e.g., "Aluva"
  destination: string,       // e.g., "Kakkanad"
  stops: [{
    id: string,
    name: string,
    time: string,            // e.g., "07:00 AM"
  }],
  duration: string,          // e.g., "1h 0m"
  distance: string,          // e.g., "18.5 km"
  createdAt: Date,
  updatedAt: Date,
}
```

### **Groups Collection**
```typescript
{
  _id: ObjectId,
  routeId: ObjectId,
  creatorId: ObjectId,
  departureTime: string,     // e.g., "07:00 AM"
  startingStop: string,
  capacity: number,          // 2-20
  currentStopIndex: number,  // For live tracking
  visibility: "open" | "college",
  college?: string,
  note?: string,
  status: "active" | "completed" | "cancelled",
  createdAt: Date,
  updatedAt: Date,
}
```

### **GroupMembers Collection**
```typescript
{
  _id: ObjectId,
  groupId: ObjectId,
  userId: ObjectId,
  status: "waiting" | "reached_stop" | "boarded" | "delayed" | "completed",
  joinedAt: Date,
  updatedAt: Date,
}
```

### **Notifications Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "group_joined" | "status_update" | "new_group" | "reminder",
  title: string,
  message: string,
  read: boolean,
  relatedGroupId?: ObjectId,
  createdAt: Date,
}
```

---

## 🔧 Available Helper Functions

### **User Operations**
```typescript
import { createUser, getUserByEmail, getUserById } from "@/lib/models"

// Create user
const userId = await createUser({
  name: "John Doe",
  email: "john@example.com",
  college: "MEC",
  city: "Kochi",
})

// Get user by email
const user = await getUserByEmail("john@example.com")

// Get user by ID
const user = await getUserById(userId)
```

### **Route Operations**
```typescript
import { searchRoutes, getRouteById } from "@/lib/models"

// Search routes
const routes = await searchRoutes("Aluva", "Kakkanad")

// Get specific route
const route = await getRouteById(routeId)
```

### **Group Operations**
```typescript
import { 
  createGroup, 
  getGroupById, 
  getGroupsByRoute,
  updateGroupLocation 
} from "@/lib/models"

// Create group
const groupId = await createGroup({
  routeId: new ObjectId(routeId),
  creatorId: new ObjectId(userId),
  departureTime: "07:00 AM",
  startingStop: "Aluva",
  capacity: 6,
  visibility: "open",
})

// Get group
const group = await getGroupById(groupId)

// Get all groups for a route
const groups = await getGroupsByRoute(routeId)

// Update location (for live tracking)
await updateGroupLocation(groupId, 2) // Now at stop index 2
```

### **Member Operations**
```typescript
import { 
  addMemberToGroup, 
  getGroupMembers,
  updateMemberStatus 
} from "@/lib/models"

// Add member to group
await addMemberToGroup(groupId, userId)

// Get all members
const members = await getGroupMembers(groupId)

// Update member status
await updateMemberStatus(groupId, userId, "boarded")
```

### **Notification Operations**
```typescript
import { 
  createNotification, 
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead 
} from "@/lib/models"

// Create notification
await createNotification({
  userId: new ObjectId(userId),
  type: "group_joined",
  title: "New member joined",
  message: "John Doe joined your group",
  read: false,
  relatedGroupId: new ObjectId(groupId),
})

// Get user notifications
const notifications = await getUserNotifications(userId)

// Mark as read
await markNotificationAsRead(notificationId)
await markAllNotificationsAsRead(userId)
```

---

## 🔌 Using in API Routes

### **Example: Search Routes API**
```typescript
// app/api/routes/search/route.ts
import { NextResponse } from "next/server"
import { searchRoutes } from "@/lib/models"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  
  if (!from || !to) {
    return NextResponse.json(
      { error: "Missing from or to parameter" },
      { status: 400 }
    )
  }
  
  const routes = await searchRoutes(from, to)
  return NextResponse.json(routes)
}
```

### **Example: Create Group API**
```typescript
// app/api/groups/route.ts
import { NextResponse } from "next/server"
import { createGroup, addMemberToGroup } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  const body = await request.json()
  
  // Create group
  const groupId = await createGroup({
    routeId: new ObjectId(body.routeId),
    creatorId: new ObjectId(body.userId),
    departureTime: body.departureTime,
    startingStop: body.startingStop,
    capacity: body.capacity,
    visibility: body.visibility,
    college: body.college,
    note: body.note,
  })
  
  // Add creator as first member
  await addMemberToGroup(groupId, body.userId)
  
  return NextResponse.json({ groupId })
}
```

---

## 🧪 Testing

### **1. Test Connection**
```bash
# Visit in browser
http://localhost:3001/api/test-db
```

### **2. Seed Database**
```bash
npm run seed
```

### **3. Verify in MongoDB Atlas**
1. Go to https://cloud.mongodb.com
2. Navigate to your cluster
3. Click "Browse Collections"
4. Select "BusUndo" database
5. You should see the `routes` collection with 4 documents

---

## 📝 Next Steps

### **1. Create API Routes** (See WORKFLOW.md)
- `/api/routes/search` - Search routes
- `/api/groups` - Create/get groups
- `/api/groups/[id]/join` - Join group
- `/api/groups/[id]/status` - Update status
- `/api/notifications` - Get/update notifications

### **2. Connect Forms**
- Dashboard search → Call search API
- Create group form → Call create group API
- Join button → Call join API
- Status buttons → Call status update API

### **3. Add NextAuth**
- Set up Google OAuth
- Create user on first login
- Store session with user ID

### **4. Add Socket.IO**
- Real-time status updates
- Live location tracking
- Instant notifications

---

## 🎯 Current Status

✅ **Completed:**
- MongoDB connection established
- Database models created
- Helper functions implemented
- Test API route created
- Seed script ready

⏳ **Next:**
- Seed the database with routes
- Create API endpoints
- Connect UI to backend
- Add authentication
- Implement real-time features

---

## 🔑 Environment Variables

Make sure `.env.local` has:
```env
MONGODB_URI=mongodb+srv://brototypeTest:vcbodheesh@clusterfortest.yvsxay2.mongodb.net/BusUndo
```

✅ Already configured!

---

## 📚 Resources

- **MongoDB Node.js Driver:** https://www.mongodb.com/docs/drivers/node/current/
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **TypeScript with MongoDB:** https://www.mongodb.com/docs/drivers/node/current/fundamentals/typescript/

---

**Status:** ✅ Database connected and ready to use!

Run `npm run seed` to populate with sample data, then start building API routes!
