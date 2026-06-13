import { config } from "dotenv";
import { createBusStop, getBusStopsCollection } from "../lib/models-v2";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

// Load environment variables
config({ path: ".env.local" });

// Dummy admin user ID for seeding
const ADMIN_USER_ID = new ObjectId();

const chavakkadTalukStops = [
  // Major Towns
  { name: "Guruvayur", lat: 10.5944, lon: 76.0392 },
  { name: "Mammiyoor", lat: 10.5867, lon: 76.0425 },
  { name: "Chavakkad", lat: 10.5833, lon: 76.0167 },
  { name: "Engandiyur", lat: 10.5667, lon: 76.0333 },
  { name: "Padoor", lat: 10.5500, lon: 76.0500 },
  { name: "Mullassery", lat: 10.5252, lon: 76.0896 },
  { name: "Venkitangu", lat: 10.5400, lon: 76.0700 },
  { name: "Enamavu", lat: 10.5300, lon: 76.0800 },
  { name: "Blangad", lat: 10.5100, lon: 76.0600 },
  { name: "Punnayur", lat: 10.6167, lon: 76.0333 },
  { name: "Punnayurkulam", lat: 10.6200, lon: 76.0400 },
  { name: "Andathode", lat: 10.5800, lon: 76.0200 },
  { name: "Manathala", lat: 10.5700, lon: 76.0250 },
  
  // Additional Stops
  { name: "Guruvayur Temple", lat: 10.5950, lon: 76.0400, aliases: ["Temple"] },
  { name: "Chavakkad Beach", lat: 10.5850, lon: 76.0100, aliases: ["Beach"] },
  { name: "Mullassery Centre", lat: 10.5260, lon: 76.0900, aliases: ["Mullassery Junction"] },
  { name: "Venkitangu Junction", lat: 10.5410, lon: 76.0710 },
  { name: "Enamavu Junction", lat: 10.5310, lon: 76.0810 },
  { name: "Padoor Junction", lat: 10.5510, lon: 76.0510 },
  { name: "Punnayur Junction", lat: 10.6170, lon: 76.0340 },
];

const thrissurTalukStops = [
  { name: "Thrissur", lat: 10.5276, lon: 76.2144 },
  { name: "Sakthan Stand", lat: 10.5200, lon: 76.2100, aliases: ["Thrissur Bus Stand", "KSRTC Stand"] },
  { name: "West Fort", lat: 10.5250, lon: 76.2120 },
  { name: "Punkunnam", lat: 10.5300, lon: 76.2200 },
  { name: "Ayyanthole", lat: 10.5350, lon: 76.2250 },
  { name: "Mannuthy", lat: 10.5400, lon: 76.2300 },
  { name: "Kuriachira", lat: 10.5150, lon: 76.2050 },
  { name: "Viyyur", lat: 10.5450, lon: 76.2350 },
  { name: "Ollur", lat: 10.5500, lon: 76.2400 },
  { name: "Cheroor", lat: 10.5550, lon: 76.2450 },
  { name: "Kanjany", lat: 10.5180, lon: 76.1900 },
  { name: "Manaloor", lat: 10.5220, lon: 76.1800 },
  { name: "Anthikad", lat: 10.5100, lon: 76.1700 },
  { name: "Peringottukara", lat: 10.5050, lon: 76.1600 },
  { name: "Poothole", lat: 10.5280, lon: 76.2180 },
  { name: "Amala", lat: 10.5320, lon: 76.2220 },
  { name: "Kechery", lat: 10.5380, lon: 76.2280 },
  { name: "Choondal", lat: 10.5420, lon: 76.2320 },
  { name: "Peechi", lat: 10.5280, lon: 76.3650 },
  { name: "Varandarappilly", lat: 10.5350, lon: 76.3750 },
  { name: "Wadakkanchery", lat: 10.6167, lon: 76.2333 },
  { name: "Mulankunnathukavu", lat: 10.5900, lon: 76.2250 },
  { name: "Pazhayannur", lat: 10.6300, lon: 76.2400 },
  { name: "Chelakkara", lat: 10.6500, lon: 76.2500 },
  { name: "Erumapetty", lat: 10.6250, lon: 76.2450 },
];

const kodungallurTalukStops = [
  { name: "Kodungallur", lat: 10.2167, lon: 76.2000 },
  { name: "Mathilakam", lat: 10.2300, lon: 76.2100 },
  { name: "Kaipamangalam", lat: 10.2400, lon: 76.2200 },
  { name: "Perinjanam", lat: 10.2500, lon: 76.2300 },
  { name: "Sringapuram", lat: 10.2200, lon: 76.1950 },
  { name: "Thriprayar", lat: 10.2100, lon: 76.1850 },
  { name: "Valapad", lat: 10.2000, lon: 76.1750 },
  { name: "Vadanappally", lat: 10.1900, lon: 76.1650 },
  { name: "Nattika", lat: 10.5000, lon: 76.1500 },
];

const chalakudyTalukStops = [
  { name: "Chalakudy", lat: 10.3000, lon: 76.3333 },
  { name: "Mala", lat: 10.3100, lon: 76.3400 },
  { name: "Kuzhur", lat: 10.3200, lon: 76.3500 },
  { name: "Athirappilly", lat: 10.2833, lon: 76.5667 },
  { name: "Vettilappara", lat: 10.2900, lon: 76.5700 },
  { name: "Pudukad", lat: 10.3300, lon: 76.3200 },
  { name: "Muriyad", lat: 10.3400, lon: 76.3100 },
  { name: "Amballur", lat: 10.3500, lon: 76.3000 },
  { name: "Puthukkad", lat: 10.3600, lon: 76.2900 },
  { name: "Aloor", lat: 10.3700, lon: 76.2800 },
];

const irinjalakudaTalukStops = [
  { name: "Irinjalakuda", lat: 10.3500, lon: 76.2167 },
  { name: "Kunnamkulam", lat: 10.6500, lon: 76.0833 },
  { name: "Chowalloorpady", lat: 10.6200, lon: 76.0600 },
  { name: "Cherpu", lat: 10.5600, lon: 76.2200 },
];

async function seedStops() {
  try {
    console.log("🌱 Seeding bus stops for Thrissur District...\n");
    
    const stopsCollection = await getBusStopsCollection();
    
    // Clear existing stops
    await stopsCollection.deleteMany({});
    console.log("✅ Cleared existing stops\n");
    
    let totalInserted = 0;
    
    // Seed Chavakkad Taluk
    console.log("📍 Seeding Chavakkad Taluk...");
    for (const stop of chavakkadTalukStops) {
      await createBusStop({
        stopName: stop.name,
        district: "Thrissur",
        taluk: "Chavakkad",
        latitude: stop.lat,
        longitude: stop.lon,
        aliases: (stop as any).aliases || [],
        verified: false,
        verifiedBy: [],
        createdBy: ADMIN_USER_ID,
      });
      totalInserted++;
    }
    console.log(`   ✅ Added ${chavakkadTalukStops.length} stops\n`);
    
    // Seed Thrissur Taluk
    console.log("📍 Seeding Thrissur Taluk...");
    for (const stop of thrissurTalukStops) {
      await createBusStop({
        stopName: stop.name,
        district: "Thrissur",
        taluk: "Thrissur",
        latitude: stop.lat,
        longitude: stop.lon,
        aliases: (stop as any).aliases || [],
        verified: false,
        verifiedBy: [],
        createdBy: ADMIN_USER_ID,
      });
      totalInserted++;
    }
    console.log(`   ✅ Added ${thrissurTalukStops.length} stops\n`);
    
    // Seed Kodungallur Taluk
    console.log("📍 Seeding Kodungallur Taluk...");
    for (const stop of kodungallurTalukStops) {
      await createBusStop({
        stopName: stop.name,
        district: "Thrissur",
        taluk: "Kodungallur",
        latitude: stop.lat,
        longitude: stop.lon,
        aliases: (stop as any).aliases || [],
        verified: false,
        verifiedBy: [],
        createdBy: ADMIN_USER_ID,
      });
      totalInserted++;
    }
    console.log(`   ✅ Added ${kodungallurTalukStops.length} stops\n`);
    
    // Seed Chalakudy Taluk
    console.log("📍 Seeding Chalakudy Taluk...");
    for (const stop of chalakudyTalukStops) {
      await createBusStop({
        stopName: stop.name,
        district: "Thrissur",
        taluk: "Chalakudy",
        latitude: stop.lat,
        longitude: stop.lon,
        aliases: (stop as any).aliases || [],
        verified: false,
        verifiedBy: [],
        createdBy: ADMIN_USER_ID,
      });
      totalInserted++;
    }
    console.log(`   ✅ Added ${chalakudyTalukStops.length} stops\n`);
    
    // Seed Irinjalakuda Taluk
    console.log("📍 Seeding Irinjalakuda Taluk...");
    for (const stop of irinjalakudaTalukStops) {
      await createBusStop({
        stopName: stop.name,
        district: "Thrissur",
        taluk: "Irinjalakuda",
        latitude: stop.lat,
        longitude: stop.lon,
        aliases: (stop as any).aliases || [],
        verified: false,
        verifiedBy: [],
        createdBy: ADMIN_USER_ID,
      });
      totalInserted++;
    }
    console.log(`   ✅ Added ${irinjalakudaTalukStops.length} stops\n`);
    
    console.log("=" .repeat(50));
    console.log(`✅ Total stops inserted: ${totalInserted}`);
    console.log("=" .repeat(50));
    
    // List all stops by taluk
    const allStops = await stopsCollection.find({}).toArray();
    const byTaluk = allStops.reduce((acc, stop) => {
      if (!acc[stop.taluk]) acc[stop.taluk] = [];
      acc[stop.taluk].push(stop.stopName);
      return acc;
    }, {} as Record<string, string[]>);
    
    console.log("\n📊 Stops by Taluk:");
    Object.entries(byTaluk).forEach(([taluk, stops]) => {
      console.log(`\n${taluk}: ${stops.length} stops`);
      stops.forEach(stop => console.log(`  - ${stop}`));
    });
    
    console.log("\n✅ Seeding completed successfully!");
    
    // Close connection
    const client = await clientPromise();
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding stops:", error);
    process.exit(1);
  }
}

seedStops();
