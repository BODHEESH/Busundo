import { config } from "dotenv";
import { getRoutesCollection } from "../lib/models";
import clientPromise from "../lib/mongodb";

// Load environment variables
config({ path: ".env.local" });

// Helper function to generate times for stops
function generateStopTimes(startTime: string, stopCount: number) {
  const [hours, minutes] = startTime.split(":").map(num => parseInt(num.replace(" AM", "").replace(" PM", "")));
  const isPM = startTime.includes("PM");
  const times = [];
  
  for (let i = 0; i < stopCount; i++) {
    const totalMinutes = (isPM ? hours + 12 : hours) * 60 + minutes + (i * 10);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    times.push(`${displayHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`);
  }
  
  return times;
}

const routes = [
  // PB001: Thrissur-Guruvayur
  {
    code: "PB001",
    source: "Sakthan Stand",
    destination: "Guruvayur",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "06:00 AM" },
      { id: "2", name: "Punkunnam", time: "06:10 AM" },
      { id: "3", name: "Amala", time: "06:20 AM" },
      { id: "4", name: "Kechery", time: "06:30 AM" },
      { id: "5", name: "Choondal", time: "06:40 AM" },
      { id: "6", name: "Kunnamkulam", time: "06:50 AM" },
      { id: "7", name: "Chowalloorpady", time: "07:00 AM" },
      { id: "8", name: "Guruvayur", time: "07:10 AM" },
    ],
    duration: "1h 10m",
    distance: "28 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB002: Thrissur-Chavakkad
  {
    code: "PB002",
    source: "Sakthan Stand",
    destination: "Chavakkad",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "07:00 AM" },
      { id: "2", name: "West Fort", time: "07:10 AM" },
      { id: "3", name: "Kanjany", time: "07:20 AM" },
      { id: "4", name: "Manaloor", time: "07:30 AM" },
      { id: "5", name: "Enamavu", time: "07:40 AM" },
      { id: "6", name: "Venkitangu", time: "07:50 AM" },
      { id: "7", name: "Mullassery", time: "08:00 AM" },
      { id: "8", name: "Engandiyur", time: "08:10 AM" },
      { id: "9", name: "Chavakkad", time: "08:20 AM" },
    ],
    duration: "1h 20m",
    distance: "32 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB003: Thrissur-Kunnamkulam
  {
    code: "PB003",
    source: "Sakthan Stand",
    destination: "Kunnamkulam",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "08:00 AM" },
      { id: "2", name: "Punkunnam", time: "08:10 AM" },
      { id: "3", name: "Amala", time: "08:20 AM" },
      { id: "4", name: "Kechery", time: "08:30 AM" },
      { id: "5", name: "Choondal", time: "08:40 AM" },
      { id: "6", name: "Kunnamkulam", time: "08:50 AM" },
    ],
    duration: "50m",
    distance: "22 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB004: Thrissur-Wadakkanchery
  {
    code: "PB004",
    source: "Sakthan Stand",
    destination: "Wadakkanchery",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "06:30 AM" },
      { id: "2", name: "Mannuthy", time: "06:40 AM" },
      { id: "3", name: "Viyyur", time: "06:50 AM" },
      { id: "4", name: "Mulankunnathukavu", time: "07:00 AM" },
      { id: "5", name: "Wadakkanchery", time: "07:10 AM" },
    ],
    duration: "40m",
    distance: "18 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB005: Thrissur-Kodungallur
  {
    code: "PB005",
    source: "Sakthan Stand",
    destination: "Kodungallur",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "07:30 AM" },
      { id: "2", name: "Ollur", time: "07:40 AM" },
      { id: "3", name: "Pudukad", time: "07:50 AM" },
      { id: "4", name: "Irinjalakuda", time: "08:00 AM" },
      { id: "5", name: "Mathilakam", time: "08:10 AM" },
      { id: "6", name: "Kodungallur", time: "08:20 AM" },
    ],
    duration: "50m",
    distance: "35 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB006: Thrissur-Irinjalakuda
  {
    code: "PB006",
    source: "Sakthan Stand",
    destination: "Irinjalakuda",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "09:00 AM" },
      { id: "2", name: "Ollur", time: "09:10 AM" },
      { id: "3", name: "Pudukad", time: "09:20 AM" },
      { id: "4", name: "Muriyad", time: "09:30 AM" },
      { id: "5", name: "Irinjalakuda", time: "09:40 AM" },
    ],
    duration: "40m",
    distance: "25 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB007: Thrissur-Chalakudy
  {
    code: "PB007",
    source: "Sakthan Stand",
    destination: "Chalakudy",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "05:30 AM" },
      { id: "2", name: "Ollur", time: "05:40 AM" },
      { id: "3", name: "Pudukad", time: "05:50 AM" },
      { id: "4", name: "Amballur", time: "06:00 AM" },
      { id: "5", name: "Chalakudy", time: "06:10 AM" },
    ],
    duration: "40m",
    distance: "28 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB008: Thrissur-Mala
  {
    code: "PB008",
    source: "Sakthan Stand",
    destination: "Mala",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "10:00 AM" },
      { id: "2", name: "Ollur", time: "10:10 AM" },
      { id: "3", name: "Pudukad", time: "10:20 AM" },
      { id: "4", name: "Kuzhur", time: "10:30 AM" },
      { id: "5", name: "Mala", time: "10:40 AM" },
    ],
    duration: "40m",
    distance: "20 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB009: Thrissur-Cherpu
  {
    code: "PB009",
    source: "Sakthan Stand",
    destination: "Cherpu",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "11:00 AM" },
      { id: "2", name: "Kuriachira", time: "11:10 AM" },
      { id: "3", name: "Cherpu", time: "11:20 AM" },
    ],
    duration: "20m",
    distance: "8 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB010: Thrissur-Vadanappally
  {
    code: "PB010",
    source: "Sakthan Stand",
    destination: "Vadanappally",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "06:00 AM" },
      { id: "2", name: "Kanjany", time: "06:10 AM" },
      { id: "3", name: "Anthikad", time: "06:20 AM" },
      { id: "4", name: "Peringottukara", time: "06:30 AM" },
      { id: "5", name: "Thriprayar", time: "06:40 AM" },
      { id: "6", name: "Valapad", time: "06:50 AM" },
      { id: "7", name: "Vadanappally", time: "07:00 AM" },
    ],
    duration: "1h 0m",
    distance: "38 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB011: Thrissur-Thriprayar
  {
    code: "PB011",
    source: "Sakthan Stand",
    destination: "Thriprayar",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "12:00 PM" },
      { id: "2", name: "Kanjany", time: "12:10 PM" },
      { id: "3", name: "Anthikad", time: "12:20 PM" },
      { id: "4", name: "Peringottukara", time: "12:30 PM" },
      { id: "5", name: "Thriprayar", time: "12:40 PM" },
    ],
    duration: "40m",
    distance: "25 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB012: Thrissur-Nattika
  {
    code: "PB012",
    source: "Sakthan Stand",
    destination: "Nattika",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "01:00 PM" },
      { id: "2", name: "Kanjany", time: "01:10 PM" },
      { id: "3", name: "Anthikad", time: "01:20 PM" },
      { id: "4", name: "Nattika", time: "01:30 PM" },
    ],
    duration: "30m",
    distance: "18 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB013: Thrissur-Kanjany
  {
    code: "PB013",
    source: "Sakthan Stand",
    destination: "Kanjany",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "02:00 PM" },
      { id: "2", name: "West Fort", time: "02:10 PM" },
      { id: "3", name: "Kanjany", time: "02:20 PM" },
    ],
    duration: "20m",
    distance: "6 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB014: Thrissur-Chelakkara
  {
    code: "PB014",
    source: "Sakthan Stand",
    destination: "Chelakkara",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "03:00 PM" },
      { id: "2", name: "Mannuthy", time: "03:10 PM" },
      { id: "3", name: "Wadakkanchery", time: "03:20 PM" },
      { id: "4", name: "Pazhayannur", time: "03:30 PM" },
      { id: "5", name: "Chelakkara", time: "03:40 PM" },
    ],
    duration: "40m",
    distance: "30 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB015: Thrissur-Erumapetty
  {
    code: "PB015",
    source: "Sakthan Stand",
    destination: "Erumapetty",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "04:00 PM" },
      { id: "2", name: "Mannuthy", time: "04:10 PM" },
      { id: "3", name: "Wadakkanchery", time: "04:20 PM" },
      { id: "4", name: "Erumapetty", time: "04:30 PM" },
    ],
    duration: "30m",
    distance: "22 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB016: Thrissur-Varandarappilly
  {
    code: "PB016",
    source: "Sakthan Stand",
    destination: "Varandarappilly",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "05:00 PM" },
      { id: "2", name: "Peechi", time: "05:10 PM" },
      { id: "3", name: "Varandarappilly", time: "05:20 PM" },
    ],
    duration: "20m",
    distance: "12 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB017: Thrissur-Peechi
  {
    code: "PB017",
    source: "Sakthan Stand",
    destination: "Peechi",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "06:00 PM" },
      { id: "2", name: "Mannuthy", time: "06:10 PM" },
      { id: "3", name: "Peechi", time: "06:20 PM" },
    ],
    duration: "20m",
    distance: "10 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB018: Thrissur-Puthukkad
  {
    code: "PB018",
    source: "Sakthan Stand",
    destination: "Puthukkad",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "07:00 PM" },
      { id: "2", name: "Ollur", time: "07:10 PM" },
      { id: "3", name: "Puthukkad", time: "07:20 PM" },
    ],
    duration: "20m",
    distance: "8 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB019: Thrissur-Kaipamangalam
  {
    code: "PB019",
    source: "Sakthan Stand",
    destination: "Kaipamangalam",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "08:00 PM" },
      { id: "2", name: "Cherpu", time: "08:10 PM" },
      { id: "3", name: "Perinjanam", time: "08:20 PM" },
      { id: "4", name: "Kaipamangalam", time: "08:30 PM" },
    ],
    duration: "30m",
    distance: "15 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // PB020: Thrissur-Aloor
  {
    code: "PB020",
    source: "Sakthan Stand",
    destination: "Aloor",
    stops: [
      { id: "1", name: "Sakthan Stand", time: "09:00 PM" },
      { id: "2", name: "Ollur", time: "09:10 PM" },
      { id: "3", name: "Pudukad", time: "09:20 PM" },
      { id: "4", name: "Aloor", time: "09:30 PM" },
    ],
    duration: "30m",
    distance: "16 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedRoutes() {
  try {
    console.log("🌱 Seeding routes...");
    
    const routesCollection = await getRoutesCollection();
    
    // Clear existing routes
    await routesCollection.deleteMany({});
    console.log("✅ Cleared existing routes");
    
    // Insert new routes
    const result = await routesCollection.insertMany(routes);
    console.log(`✅ Inserted ${result.insertedCount} routes`);
    
    // List all routes
    const allRoutes = await routesCollection.find({}).toArray();
    console.log("\n📍 Routes in database:");
    allRoutes.forEach((route) => {
      console.log(`  - ${route.code}: ${route.source} → ${route.destination}`);
    });
    
    console.log("\n✅ Seeding completed successfully!");
    
    // Close connection
    const client = await clientPromise();
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding routes:", error);
    process.exit(1);
  }
}

seedRoutes();
