import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

// User Model
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  image?: string;
  college?: string;
  city?: string;
  favoriteRoutes?: ObjectId[];
  notifications?: {
    groupUpdates: boolean;
    newGroups: boolean;
    reminders: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection<User>("users");
}

// Route Model
export interface Route {
  _id?: ObjectId;
  code: string;
  source: string;
  destination: string;
  stops: {
    id: string;
    name: string;
    time: string;
  }[];
  duration: string;
  distance: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getRoutesCollection() {
  const db = await getDatabase();
  return db.collection<Route>("routes");
}

// Group Model
export interface Group {
  _id?: ObjectId;
  routeId: ObjectId;
  creatorId: ObjectId;
  departureTime: string;
  startingStop: string;
  capacity: number;
  currentStopIndex: number;
  visibility: "open" | "college";
  college?: string;
  note?: string;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export async function getGroupsCollection() {
  const db = await getDatabase();
  return db.collection<Group>("groups");
}

// GroupMember Model
export interface GroupMember {
  _id?: ObjectId;
  groupId: ObjectId;
  userId: ObjectId;
  status: "waiting" | "reached_stop" | "boarded" | "delayed" | "completed";
  joinedAt: Date;
  updatedAt: Date;
}

export async function getGroupMembersCollection() {
  const db = await getDatabase();
  return db.collection<GroupMember>("groupMembers");
}

// Notification Model
export interface Notification {
  _id?: ObjectId;
  userId: ObjectId;
  type: "group_joined" | "status_update" | "new_group" | "reminder";
  title: string;
  message: string;
  read: boolean;
  relatedGroupId?: ObjectId;
  createdAt: Date;
}

export async function getNotificationsCollection() {
  const db = await getDatabase();
  return db.collection<Notification>("notifications");
}

// Helper functions for common queries

// Users
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  const users = await getUsersCollection();
  const result = await users.insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function getUserByEmail(email: string) {
  const users = await getUsersCollection();
  return users.findOne({ email });
}

export async function getUserById(id: string | ObjectId) {
  const users = await getUsersCollection();
  const objectId = typeof id === "string" ? new ObjectId(id) : id;
  return users.findOne({ _id: objectId });
}

// Routes
export async function searchRoutes(from: string, to: string) {
  const routes = await getRoutesCollection();
  return routes
    .find({
      $or: [
        { source: from, destination: to },
        {
          "stops.name": { $all: [from, to] },
        },
      ],
    })
    .toArray();
}

export async function getRouteById(id: string | ObjectId) {
  const routes = await getRoutesCollection();
  const objectId = typeof id === "string" ? new ObjectId(id) : id;
  return routes.findOne({ _id: objectId });
}

// Groups
export async function createGroup(groupData: Omit<Group, "_id" | "createdAt" | "updatedAt">) {
  const groups = await getGroupsCollection();
  const result = await groups.insertOne({
    ...groupData,
    currentStopIndex: 0,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function getGroupById(id: string | ObjectId) {
  const groups = await getGroupsCollection();
  const objectId = typeof id === "string" ? new ObjectId(id) : id;
  return groups.findOne({ _id: objectId });
}

export async function getGroupsByRoute(routeId: string | ObjectId) {
  const groups = await getGroupsCollection();
  const objectId = typeof routeId === "string" ? new ObjectId(routeId) : routeId;
  return groups.find({ routeId: objectId, status: "active" }).toArray();
}

export async function updateGroupLocation(groupId: string | ObjectId, stopIndex: number) {
  const groups = await getGroupsCollection();
  const objectId = typeof groupId === "string" ? new ObjectId(groupId) : groupId;
  return groups.updateOne(
    { _id: objectId },
    { $set: { currentStopIndex: stopIndex, updatedAt: new Date() } }
  );
}

// Group Members
export async function addMemberToGroup(groupId: string | ObjectId, userId: string | ObjectId) {
  const members = await getGroupMembersCollection();
  const groupObjectId = typeof groupId === "string" ? new ObjectId(groupId) : groupId;
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;

  const result = await members.insertOne({
    groupId: groupObjectId,
    userId: userObjectId,
    status: "waiting",
    joinedAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function getGroupMembers(groupId: string | ObjectId) {
  const members = await getGroupMembersCollection();
  const objectId = typeof groupId === "string" ? new ObjectId(groupId) : groupId;
  return members.find({ groupId: objectId }).toArray();
}

export async function updateMemberStatus(
  groupId: string | ObjectId,
  userId: string | ObjectId,
  status: GroupMember["status"]
) {
  const members = await getGroupMembersCollection();
  const groupObjectId = typeof groupId === "string" ? new ObjectId(groupId) : groupId;
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;

  return members.updateOne(
    { groupId: groupObjectId, userId: userObjectId },
    { $set: { status, updatedAt: new Date() } }
  );
}

// Notifications
export async function createNotification(
  notificationData: Omit<Notification, "_id" | "createdAt">
) {
  const notifications = await getNotificationsCollection();
  const result = await notifications.insertOne({
    ...notificationData,
    createdAt: new Date(),
  });
  return result.insertedId;
}

export async function getUserNotifications(userId: string | ObjectId) {
  const notifications = await getNotificationsCollection();
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  return notifications.find({ userId: objectId }).sort({ createdAt: -1 }).toArray();
}

export async function markNotificationAsRead(notificationId: string | ObjectId) {
  const notifications = await getNotificationsCollection();
  const objectId = typeof notificationId === "string" ? new ObjectId(notificationId) : notificationId;
  return notifications.updateOne({ _id: objectId }, { $set: { read: true } });
}

export async function markAllNotificationsAsRead(userId: string | ObjectId) {
  const notifications = await getNotificationsCollection();
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  return notifications.updateMany({ userId: objectId, read: false }, { $set: { read: true } });
}
