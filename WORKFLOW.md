# BusUndo - Complete User Workflow & Functionality

## 🎯 Overview

This document explains the complete user journey through the BusUndo app, from first visit to logout, including all features and interactions.

---

## 📱 Complete User Journey

### **Phase 1: Discovery & Registration**

#### **Step 1: Landing Page** (`/`)
**What User Sees:**
- Hero section with "Bus Undo? Open BusUndo" tagline
- Search inputs (From/To) - *Currently non-functional*
- Features showcase
- How it works section
- Student testimonials
- Call-to-action buttons

**User Actions:**
1. Click "Sign in" (top right) → Goes to `/login`
2. Click "Get Started" (top right) → Goes to `/dashboard`
3. Scroll to learn about features

**Current Status:** ✅ UI Complete | ⚠️ Search not connected

---

#### **Step 2: Login** (`/login`)
**What User Sees:**
- Welcome message
- "Continue with Google" button
- "Continue with Email" option
- Terms & Privacy links

**User Actions:**
1. Click "Continue with Google" → *Should trigger Google OAuth*
2. Click "Continue with Email" → *Should show email form*

**Current Status:** ✅ UI Complete | ❌ Auth Not Implemented

**What Needs to Be Built:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      session.user.id = token.sub
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

#### **Step 3: Onboarding** (`/onboarding`)
**What User Sees:**
- College selection (radio buttons)
- Primary city dropdown
- Notification preferences (3 checkboxes)
- "Complete setup" button

**User Actions:**
1. Select college from list
2. Choose primary city
3. Toggle notification preferences
4. Click "Complete setup" → Goes to `/dashboard`

**Current Status:** ✅ UI Complete | ❌ Not Connected to Auth Flow

**What Needs to Be Built:**
```typescript
// app/onboarding/page.tsx - Add form submission
"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function OnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    college: "",
    city: "",
    notifications: {
      groupUpdates: true,
      newGroups: true,
      reminders: true,
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Save to database
    const response = await fetch("/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify(formData),
    })
    
    if (response.ok) {
      router.push("/dashboard")
    }
  }

  return (
    // ... existing UI with form submission
  )
}
```

---

### **Phase 2: Daily Usage**

#### **Step 4: Dashboard** (`/dashboard`)
**What User Sees:**
- Personalized greeting: "Good morning, [Name]"
- Search form (From/To locations)
- Active groups section (groups user has joined)
- Recent routes section
- Notification bell icon (with badge count)
- Profile avatar (top right)

**User Actions:**
1. **Search for routes:**
   - Enter "From" location
   - Enter "To" location
   - Click "Find travel groups" → Goes to `/search`

2. **View active groups:**
   - Click on any active group card → Goes to `/groups/[id]`

3. **View recent routes:**
   - Click on any route card → Goes to `/routes/[id]`

4. **Check notifications:**
   - Click bell icon → Goes to `/notifications`

5. **View profile:**
   - Click profile avatar → Goes to `/profile`

**Current Status:** ✅ UI Complete | ❌ Search Not Functional

**What Needs to Be Built:**
```typescript
// app/dashboard/page.tsx - Make search functional
"use client"

export default function DashboardPage() {
  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const from = formData.get("from")
    const to = formData.get("to")
    
    // Navigate to search with query params
    router.push(`/search?from=${from}&to=${to}`)
  }

  return (
    <form onSubmit={handleSearch}>
      {/* ... existing form */}
    </form>
  )
}
```

---

#### **Step 5: Search Results** (`/search`)
**What User Sees:**
- Search query display (From → To)
- "Edit" button to modify search
- Route count: "2 routes found"
- List of matching routes with:
  - Route code (e.g., KL-07 / 412)
  - Source → Destination
  - Duration, distance, stops
  - Active groups count
  - Total travelers
  - Next departure time

**User Actions:**
1. Click "Edit" → Goes back to `/dashboard`
2. Click any route card → Goes to `/routes/[id]`

**Current Status:** ✅ UI Complete | ⚠️ Uses Mock Data

**What Needs to Be Built:**
```typescript
// app/api/routes/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  
  // Query database for matching routes
  const routes = await db.routes.find({
    $or: [
      { source: from, destination: to },
      { stops: { $all: [from, to] } }
    ]
  })
  
  return Response.json(routes)
}
```

---

#### **Step 6: Route Details** (`/routes/[id]`)
**What User Sees:**
- Route code and name
- Duration, distance, stops count
- Timeline of all stops with times
- "New group" button
- List of available travel groups:
  - Departure time
  - Members count (e.g., 4/6 joined)
  - College restriction
  - "Join" button

**User Actions:**
1. Click "New group" → Goes to `/groups/create`
2. Click any group card → Goes to `/groups/[id]`
3. Click "Join" on a group → *Should join group and go to group detail*

**Current Status:** ✅ UI Complete | ❌ Join Not Functional

**What Needs to Be Built:**
```typescript
// app/routes/[id]/page.tsx - Add join functionality
"use client"

const handleJoinGroup = async (groupId: string) => {
  const response = await fetch(`/api/groups/${groupId}/join`, {
    method: "POST",
  })
  
  if (response.ok) {
    router.push(`/groups/${groupId}`)
  }
}

// Update Join button
<button onClick={() => handleJoinGroup(group.id)}>
  Join
</button>
```

---

#### **Step 7: Create Group** (`/groups/create`)
**What User Sees:**
- Selected route information
- Form fields:
  - Departure time (time picker)
  - Starting stop (dropdown)
  - Group size (number input, 2-20)
  - Visibility (Open to all / College only)
  - Optional note (textarea)
- Info about group chat
- "Create group" button

**User Actions:**
1. Select departure time
2. Choose starting stop
3. Set group size
4. Choose visibility
5. Add optional note
6. Click "Create group" → Goes to `/groups/[id]`

**Current Status:** ✅ UI Complete | ❌ Form Not Functional

**What Needs to Be Built:**
```typescript
// app/groups/create/page.tsx - Add form submission
"use client"

const handleCreateGroup = async (e: FormEvent) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  
  const groupData = {
    routeId: route.id,
    departureTime: formData.get("time"),
    startingStop: formData.get("stop"),
    capacity: parseInt(formData.get("size") as string),
    visibility: formData.get("visibility"),
    note: formData.get("note"),
  }
  
  const response = await fetch("/api/groups", {
    method: "POST",
    body: JSON.stringify(groupData),
  })
  
  const { groupId } = await response.json()
  router.push(`/groups/${groupId}`)
}
```

---

#### **Step 8: Group Detail** (`/groups/[id]`)
**What User Sees:**
- Route and group information
- **Live journey section:**
  - Animated bus icon
  - Real-time pulsing indicator
  - Timeline of stops with current position
- **Your status section** (if member):
  - Status buttons: Waiting, Reached stop, Boarded bus, Delayed, Completed
  - Currently selected status highlighted
- **Members section:**
  - List of members with avatars and status
  - Empty spots shown as dashed boxes
- **Share section:**
  - Shareable link
  - Copy button
  - Social media buttons (WhatsApp, Telegram, Facebook, Instagram)

**User Actions:**
1. **Update status:**
   - Click status button → *Should update in real-time for all members*

2. **Share group:**
   - Click "Copy" → Copies link to clipboard
   - Click social media button → Opens share dialog

3. **Navigate:**
   - Click back → Goes to `/dashboard`

**Current Status:** ✅ UI Complete | ❌ Real-time Not Implemented

**What Needs to Be Built:**

**A. Status Update:**
```typescript
// app/groups/[id]/page.tsx - Add status update
"use client"

const handleStatusUpdate = async (newStatus: TravelStatus) => {
  const response = await fetch(`/api/groups/${group.id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status: newStatus }),
  })
  
  if (response.ok) {
    // Trigger real-time update via Socket.IO
    socket.emit("status-update", {
      groupId: group.id,
      userId: currentUser.id,
      status: newStatus,
    })
  }
}
```

**B. Real-time Updates (Socket.IO):**
```typescript
// lib/socket.ts
import { io } from "socket.io-client"

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!)

// Listen for updates
socket.on("status-update", (data) => {
  // Update UI when member status changes
  updateMemberStatus(data.userId, data.status)
})

socket.on("location-update", (data) => {
  // Update current stop position
  updateCurrentStop(data.stopIndex)
})
```

**C. Share Functionality:**
```typescript
// app/groups/[id]/page.tsx - Add copy and share
const handleCopyLink = async () => {
  await navigator.clipboard.writeText(`https://BusUndo.app/g/${group.id}`)
  // Show toast notification
}

const handleShare = (platform: string) => {
  const url = `https://BusUndo.app/g/${group.id}`
  const text = `Join my travel group: ${route.source} → ${route.destination}`
  
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
  }
  
  window.open(shareUrls[platform], "_blank")
}
```

---

#### **Step 9: Notifications** (`/notifications`)
**What User Sees:**
- Notification count
- "Mark all read" button
- List of notifications:
  - Group joined
  - Status updates
  - New groups on routes
  - Departure reminders
- Unread notifications highlighted
- Read notifications grayed out

**User Actions:**
1. Click notification → Goes to relevant page
2. Click "Mark all read" → Marks all as read

**Current Status:** ✅ UI Complete | ❌ Not Connected to Backend

**What Needs to Be Built:**
```typescript
// app/api/notifications/route.ts
export async function GET() {
  const session = await getServerSession()
  
  const notifications = await db.notifications.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 })
  
  return Response.json(notifications)
}

export async function PUT() {
  const session = await getServerSession()
  
  await db.notifications.updateMany(
    { userId: session.user.id, read: false },
    { $set: { read: true } }
  )
  
  return Response.json({ success: true })
}
```

---

#### **Step 10: Profile** (`/profile`)
**What User Sees:**
- User avatar and name
- Email address
- College name
- Favorite routes section
- Travel history section
- "Sign out" button

**User Actions:**
1. Click favorite route → Goes to `/routes/[id]`
2. Click "Sign out" → Logs out and goes to `/`

**Current Status:** ✅ UI Complete | ❌ Sign Out Not Functional

**What Needs to Be Built:**
```typescript
// app/profile/page.tsx - Add sign out
"use client"
import { signOut } from "next-auth/react"

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/" })
}

<button onClick={handleSignOut}>
  <LogOut className="h-4 w-4" />
  Sign out
</button>
```

---

### **Phase 3: Public Sharing**

#### **Step 11: Public Group View** (`/g/[id]`)
**What User Sees:**
- BusUndo logo and "Sign in" button
- Route and group information
- Route stops timeline
- Members list with status
- Open spots
- "Sign in to join" call-to-action

**User Actions:**
1. Click "Sign in" → Goes to `/login`
2. After login → Automatically joins group

**Current Status:** ✅ UI Complete | ❌ Auto-join Not Implemented

**What Needs to Be Built:**
```typescript
// app/g/[id]/page.tsx - Add auto-join after login
// Store intended group ID in session storage
const handleSignInToJoin = () => {
  sessionStorage.setItem("joinGroupId", group.id)
  router.push("/login")
}

// In login callback
// app/api/auth/[...nextauth]/route.ts
callbacks: {
  async signIn({ user }) {
    const joinGroupId = sessionStorage.getItem("joinGroupId")
    if (joinGroupId) {
      // Auto-join the group
      await joinGroup(user.id, joinGroupId)
      sessionStorage.removeItem("joinGroupId")
    }
    return true
  }
}
```

---

## 🔄 Real-time Features (To Be Implemented)

### **1. Live Journey Tracking**
**How It Should Work:**
- Bus conductor/driver updates current location
- All group members see updated stop position
- Timeline animates to show progress
- Notifications sent when bus reaches stops

**Implementation:**
```typescript
// Server-side (Socket.IO)
io.on("connection", (socket) => {
  socket.on("update-location", async ({ groupId, stopIndex }) => {
    // Update database
    await db.groups.updateOne(
      { _id: groupId },
      { $set: { currentStopIndex: stopIndex } }
    )
    
    // Broadcast to all group members
    io.to(groupId).emit("location-updated", { stopIndex })
  })
})

// Client-side
socket.on("location-updated", ({ stopIndex }) => {
  setCurrentStopIndex(stopIndex)
})
```

### **2. Status Updates**
**How It Should Work:**
- Member clicks status button
- Status updates instantly for all members
- Notification sent to group

**Implementation:**
```typescript
// When user updates status
const updateStatus = async (status: TravelStatus) => {
  await fetch(`/api/groups/${groupId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
  
  socket.emit("status-changed", {
    groupId,
    userId: currentUser.id,
    status,
  })
}

// Other members receive update
socket.on("status-changed", ({ userId, status }) => {
  updateMemberStatus(userId, status)
})
```

### **3. New Member Joins**
**How It Should Work:**
- User joins group
- All existing members get notification
- Member list updates in real-time

**Implementation:**
```typescript
socket.on("member-joined", ({ member }) => {
  addMemberToList(member)
  showNotification(`${member.name} joined the group`)
})
```

---

## 📊 Data Flow

### **User Registration Flow**
```
Landing Page → Login → Google OAuth → Onboarding → Dashboard
                                    ↓
                            Create User in DB
                            Save Preferences
```

### **Search & Join Flow**
```
Dashboard → Search → Route Details → Group Details
    ↓          ↓           ↓              ↓
Enter From/To  Query DB   View Groups   Join Group
                          Create Group   Update Status
```

### **Real-time Update Flow**
```
User Action → API Call → Database Update → Socket.IO Emit → All Clients Update
```

---

## 🗄️ Database Schema Needed

### **Users Collection**
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  image: string,
  college: string,
  city: string,
  favoriteRoutes: ObjectId[],
  notifications: {
    groupUpdates: boolean,
    newGroups: boolean,
    reminders: boolean,
  },
  createdAt: Date,
}
```

### **Routes Collection**
```typescript
{
  _id: ObjectId,
  code: string,
  source: string,
  destination: string,
  stops: [{
    id: string,
    name: string,
    time: string,
  }],
  duration: string,
  distance: string,
  createdAt: Date,
}
```

### **Groups Collection**
```typescript
{
  _id: ObjectId,
  routeId: ObjectId,
  creatorId: ObjectId,
  departureTime: string,
  startingStop: string,
  capacity: number,
  currentStopIndex: number,
  visibility: "open" | "college",
  college: string,
  note: string,
  status: "active" | "completed" | "cancelled",
  createdAt: Date,
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
  relatedGroupId: ObjectId,
  createdAt: Date,
}
```

---

## 🔧 API Endpoints Needed

### **Authentication**
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/user/onboarding` - Save onboarding data

### **Routes**
- `GET /api/routes/search?from=X&to=Y` - Search routes
- `GET /api/routes/:id` - Get route details

### **Groups**
- `POST /api/groups` - Create group
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join group
- `PUT /api/groups/:id/status` - Update member status
- `PUT /api/groups/:id/location` - Update current location

### **Notifications**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications` - Mark all as read
- `PUT /api/notifications/:id` - Mark one as read

### **User**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/favorite/:routeId` - Add favorite route

---

## 🚀 Implementation Priority

### **Phase 1: Core Functionality** (Week 1-2)
1. ✅ UI Complete
2. ⏳ NextAuth setup with Google OAuth
3. ⏳ MongoDB connection and models
4. ⏳ Onboarding flow
5. ⏳ Route search functionality
6. ⏳ Create and join groups

### **Phase 2: Real-time Features** (Week 3-4)
1. ⏳ Socket.IO setup
2. ⏳ Live status updates
3. ⏳ Location tracking
4. ⏳ Notifications system

### **Phase 3: Polish** (Week 5-6)
1. ⏳ Share functionality
2. ⏳ Profile management
3. ⏳ Favorite routes
4. ⏳ Travel history
5. ⏳ Error handling
6. ⏳ Loading states

---

## 📝 Current Status Summary

| Feature | UI | Backend | Real-time | Status |
|---------|-----|---------|-----------|--------|
| Landing Page | ✅ | ❌ | N/A | UI Only |
| Login | ✅ | ❌ | N/A | UI Only |
| Onboarding | ✅ | ❌ | N/A | UI Only |
| Dashboard | ✅ | ❌ | N/A | UI Only |
| Search | ✅ | ❌ | N/A | Mock Data |
| Route Details | ✅ | ❌ | N/A | Mock Data |
| Create Group | ✅ | ❌ | N/A | UI Only |
| Group Detail | ✅ | ❌ | ❌ | Mock Data |
| Notifications | ✅ | ❌ | ❌ | Mock Data |
| Profile | ✅ | ❌ | N/A | Mock Data |
| Public Group | ✅ | ❌ | N/A | Mock Data |

---

## 🎯 Next Steps to Make It Functional

1. **Set up NextAuth** - Enable Google OAuth login
2. **Connect MongoDB** - Store real user and group data
3. **Implement API routes** - Handle all CRUD operations
4. **Add Socket.IO** - Enable real-time updates
5. **Connect forms** - Make all buttons and forms functional
6. **Add error handling** - Handle edge cases
7. **Add loading states** - Show spinners during operations
8. **Test workflow** - End-to-end testing

---

**Current Status:** ✅ Beautiful UI with animations | ⏳ Backend implementation needed

This workflow document serves as the blueprint for implementing all functionality!
