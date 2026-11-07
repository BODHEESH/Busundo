import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

// ============================================
// BUS STOPS COLLECTION
// ============================================

export interface BusStop {
  _id?: ObjectId;
  stopName: string;
  district: string;
  taluk: string;
  latitude?: number;
  longitude?: number;
  aliases: string[];
  verified: boolean;
  verifiedBy: ObjectId[];
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export async function getBusStopsCollection() {
  const db = await getDatabase();
  return db.collection<BusStop>("busStops");
}

// ============================================
// ROUTES COLLECTION
// ============================================

export interface Route {
  _id?: ObjectId;
  routeId: string; // e.g., "PB001"
  routeName: string; // e.g., "Thrissur-Chavakkad"
  district: string;
  stops: string[]; // Array of stop names in order
  verified: boolean;
  verifiedBy: ObjectId[];
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export async function getRoutesCollectionV2() {
  const db = await getDatabase();
  return db.collection<Route>("routes");
}

// ============================================
// PENDING SUGGESTIONS COLLECTION
// ============================================

export interface PendingSuggestion {
  _id?: ObjectId;
  type: "stop" | "route" | "missing_stop";
  routeId?: string;
  stopName?: string;
  newRouteName?: string;
  newRouteStops?: string[];
  district?: string;
  taluk?: string;
  userId: ObjectId;
  status: "pending" | "approved" | "rejected";
  approvals: ObjectId[];
  rejections: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getPendingSuggestionsCollection() {
  const db = await getDatabase();
  return db.collection<PendingSuggestion>("pendingSuggestions");
}

// ============================================
// HELPER FUNCTIONS - BUS STOPS
// ============================================

export async function createBusStop(stopData: Omit<BusStop, "_id" | "createdAt" | "updatedAt">) {
  const stops = await getBusStopsCollection();
  
  // Check if stop already exists
  const existing = await stops.findOne({
    $or: [
      { stopName: { $regex: new RegExp(`^${stopData.stopName}$`, "i") } },
      { aliases: { $in: [stopData.stopName] } }
    ]
  });
  
  if (existing) {
    return existing._id;
  }
  
  const result = await stops.insertOne({
    ...stopData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return result.insertedId;
}

export async function findBusStop(stopName: string) {
  const stops = await getBusStopsCollection();
  return stops.findOne({
    $or: [
      { stopName: { $regex: new RegExp(`^${stopName}$`, "i") } },
      { aliases: { $elemMatch: { $regex: new RegExp(`^${stopName}$`, "i") } } }
    ]
  });
}

export async function searchBusStops(query: string) {
  const stops = await getBusStopsCollection();
  return stops.find({
    $or: [
      { stopName: { $regex: new RegExp(query, "i") } },
      { aliases: { $elemMatch: { $regex: new RegExp(query, "i") } } }
    ]
  }).limit(20).toArray();
}

export async function verifyBusStop(stopId: ObjectId | string, userId: ObjectId | string) {
  const stops = await getBusStopsCollection();
  const stopObjectId = typeof stopId === "string" ? new ObjectId(stopId) : stopId;
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  
  const result = await stops.updateOne(
    { _id: stopObjectId },
    { 
      $addToSet: { verifiedBy: userObjectId },
      $set: { updatedAt: new Date() }
    }
  );
  
  // Check if we have 5+ verifications
  const stop = await stops.findOne({ _id: stopObjectId });
  if (stop && stop.verifiedBy.length >= 5 && !stop.verified) {
    await stops.updateOne(
      { _id: stopObjectId },
      { $set: { verified: true, updatedAt: new Date() } }
    );
  }
  
  return result;
}

// ============================================
// HELPER FUNCTIONS - ROUTES
// ============================================

export async function createRoute(routeData: Omit<Route, "_id" | "createdAt" | "updatedAt">) {
  const routes = await getRoutesCollectionV2();
  
  // Check if route already exists
  const existing = await routes.findOne({ routeId: routeData.routeId });
  if (existing) {
    throw new Error(`Route ${routeData.routeId} already exists`);
  }
  
  const result = await routes.insertOne({
    ...routeData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return result.insertedId;
}

export async function bulkCreateRoute(
  routeId: string,
  routeName: string,
  district: string,
  stopsText: string,
  createdBy: ObjectId
) {
  // Parse stops from text (one per line)
  const stopNames = stopsText
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Create missing stops
  const stops = await getBusStopsCollection();
  for (const stopName of stopNames) {
    const existing = await findBusStop(stopName);
    if (!existing) {
      await createBusStop({
        stopName,
        district,
        taluk: "", // Will be updated later
        aliases: [],
        verified: false,
        verifiedBy: [],
        createdBy,
      });
    }
  }
  
  // Create route
  return createRoute({
    routeId,
    routeName,
    district,
    stops: stopNames,
    verified: false,
    verifiedBy: [],
    createdBy,
  });
}

export async function findDirectRoutes(fromStop: string, toStop: string) {
  const routes = await getRoutesCollectionV2();
  const fromLower = fromStop.toLowerCase();
  const toLower = toStop.toLowerCase();

  // Hide user submissions until an admin approves or rejects them.
  // Seeded routes have no status field, so they remain visible.
  // (Still loads all routes; add a DB-side stop index before large scale.)
  const allRoutes = await routes
    .find({ status: { $nin: ["pending", "rejected"] } })
    .toArray();

  const validRoutes = allRoutes.filter((route) => {
    const fromIndex = route.stops.findIndex((s: string) =>
      s.toLowerCase().includes(fromLower)
    );
    const toIndex = route.stops.findIndex((s: string) =>
      s.toLowerCase().includes(toLower)
    );
    return fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex;
  });

  return validRoutes.map((route) => {
    const fromIndex = route.stops.findIndex((s: string) =>
      s.toLowerCase().includes(fromLower)
    );
    const toIndex = route.stops.findIndex((s: string) =>
      s.toLowerCase().includes(toLower)
    );

    const isReturn = fromIndex > toIndex;
    const startIdx = Math.min(fromIndex, toIndex);
    const endIdx = Math.max(fromIndex, toIndex);

    return {
      route,
      boardAt: route.stops[fromIndex],
      dropAt: route.stops[toIndex],
      stopsInBetween: endIdx - startIdx - 1,
      journeyStops: route.stops.slice(startIdx, endIdx + 1),
      isReturn,
    };
  });
}

export async function findOneChangeRoutes(fromStop: string, toStop: string) {
  const routes = await getRoutesCollectionV2();
  const allRoutes = await routes.find({}).toArray();
  const fromLower = fromStop.toLowerCase();
  const toLower = toStop.toLowerCase();

  const oneChangeOptions: Array<{
    route1: Route;
    route2: Route;
    changeAt: string;
    boardAt: string;
    dropAt: string;
  }> = [];

  // Find routes from source (partial match)
  const fromRoutes = allRoutes.filter((route) =>
    route.stops.some((s: string) => s.toLowerCase().includes(fromLower))
  );

  // Find routes to destination (partial match)
  const toRoutes = allRoutes.filter((route) =>
    route.stops.some((s: string) => s.toLowerCase().includes(toLower))
  );

  // Find common stops (interchange points)
  for (const route1 of fromRoutes) {
    const fromIndex = route1.stops.findIndex((s: string) =>
      s.toLowerCase().includes(fromLower)
    );

    // Get all stops after source in route1
    const stopsAfterSource = route1.stops.slice(fromIndex + 1);

    for (const route2 of toRoutes) {
      const toIndex = route2.stops.findIndex((s: string) =>
        s.toLowerCase().includes(toLower)
      );

      // Get all stops before destination in route2
      const stopsBeforeDestination = route2.stops.slice(0, toIndex);

      // Find common stops
      const commonStops = stopsAfterSource.filter((stop: string) =>
        stopsBeforeDestination.some((s: string) => s.toLowerCase() === stop.toLowerCase())
      );

      if (commonStops.length > 0) {
        // Use the first common stop as interchange
        const changeAt = commonStops[0];

        oneChangeOptions.push({
          route1,
          route2,
          changeAt,
          boardAt: route1.stops[fromIndex],
          dropAt: route2.stops[toIndex],
        });
      }
    }
  }

  return oneChangeOptions;
}

export async function verifyRoute(routeId: string, userId: ObjectId | string) {
  const routes = await getRoutesCollectionV2();
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  
  const result = await routes.updateOne(
    { routeId },
    { 
      $addToSet: { verifiedBy: userObjectId },
      $set: { updatedAt: new Date() }
    }
  );
  
  // Check if we have 5+ verifications
  const route = await routes.findOne({ routeId });
  if (route && route.verifiedBy.length >= 5 && !route.verified) {
    await routes.updateOne(
      { routeId },
      { $set: { verified: true, updatedAt: new Date() } }
    );
  }
  
  return result;
}

// ============================================
// HELPER FUNCTIONS - SUGGESTIONS
// ============================================

export async function createSuggestion(
  suggestionData: Omit<PendingSuggestion, "_id" | "createdAt" | "updatedAt" | "approvals" | "rejections">
) {
  const suggestions = await getPendingSuggestionsCollection();
  const result = await suggestions.insertOne({
    ...suggestionData,
    approvals: [],
    rejections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId;
}

export async function approveSuggestion(suggestionId: ObjectId | string, userId: ObjectId | string) {
  const suggestions = await getPendingSuggestionsCollection();
  const suggestionObjectId = typeof suggestionId === "string" ? new ObjectId(suggestionId) : suggestionId;
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  
  await suggestions.updateOne(
    { _id: suggestionObjectId },
    { 
      $addToSet: { approvals: userObjectId },
      $pull: { rejections: userObjectId },
      $set: { updatedAt: new Date() }
    }
  );
  
  // Check if we have 5+ approvals
  const suggestion = await suggestions.findOne({ _id: suggestionObjectId });
  if (suggestion && suggestion.approvals.length >= 5) {
    await suggestions.updateOne(
      { _id: suggestionObjectId },
      { $set: { status: "approved", updatedAt: new Date() } }
    );
    
    // Auto-apply the suggestion
    if (suggestion.type === "stop" && suggestion.stopName) {
      await createBusStop({
        stopName: suggestion.stopName,
        district: suggestion.district || "",
        taluk: suggestion.taluk || "",
        aliases: [],
        verified: false,
        verifiedBy: [],
        createdBy: suggestion.userId,
      });
    }
  }
  
  return suggestion;
}

export async function getUserSuggestions(userId: ObjectId | string) {
  const suggestions = await getPendingSuggestionsCollection();
  const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  return suggestions.find({ userId: userObjectId }).sort({ createdAt: -1 }).toArray();
}

export async function getPendingSuggestionsList(limit: number = 50) {
  const suggestions = await getPendingSuggestionsCollection();
  return suggestions.find({ status: "pending" }).sort({ createdAt: -1 }).limit(limit).toArray();
}
