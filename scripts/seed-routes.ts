import { getRoutesCollection } from "../lib/models";
import clientPromise from "../lib/mongodb";

const routes = [
  {
    code: "KL-07 / 412",
    source: "Aluva",
    destination: "Kakkanad",
    stops: [
      { id: "1", name: "Aluva", time: "07:00 AM" },
      { id: "2", name: "Pulinchode", time: "07:12 AM" },
      { id: "3", name: "Kalamassery", time: "07:25 AM" },
      { id: "4", name: "Edappally", time: "07:40 AM" },
      { id: "5", name: "Kakkanad", time: "08:00 AM" },
    ],
    duration: "1h 0m",
    distance: "18.5 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    code: "KL-07 / 413",
    source: "Aluva",
    destination: "Kakkanad",
    stops: [
      { id: "1", name: "Aluva", time: "08:30 AM" },
      { id: "2", name: "Kalamassery", time: "08:45 AM" },
      { id: "3", name: "Edappally", time: "09:00 AM" },
      { id: "4", name: "Kakkanad", time: "09:15 AM" },
    ],
    duration: "45m",
    distance: "16.2 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    code: "KL-01 / 201",
    source: "Ernakulam",
    destination: "Kochi",
    stops: [
      { id: "1", name: "Ernakulam", time: "06:00 AM" },
      { id: "2", name: "MG Road", time: "06:15 AM" },
      { id: "3", name: "Marine Drive", time: "06:30 AM" },
      { id: "4", name: "Fort Kochi", time: "06:50 AM" },
    ],
    duration: "50m",
    distance: "12.3 km",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    code: "KL-14 / 501",
    source: "Thrissur",
    destination: "Ernakulam",
    stops: [
      { id: "1", name: "Thrissur", time: "05:30 AM" },
      { id: "2", name: "Chalakudy", time: "06:00 AM" },
      { id: "3", name: "Angamaly", time: "06:30 AM" },
      { id: "4", name: "Aluva", time: "07:00 AM" },
      { id: "5", name: "Ernakulam", time: "07:45 AM" },
    ],
    duration: "2h 15m",
    distance: "55.8 km",
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
    const client = await clientPromise;
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding routes:", error);
    process.exit(1);
  }
}

seedRoutes();
