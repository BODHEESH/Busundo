import { config } from "dotenv";
import { bulkCreateRoute, getRoutesCollectionV2 } from "../lib/models-v2";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

// Load environment variables
config({ path: ".env.local" });

// Dummy admin user ID for seeding
const ADMIN_USER_ID = new ObjectId();

const routes = [
  {
    routeId: "PB001",
    routeName: "Thrissur-Guruvayur",
    district: "Thrissur",
    stops: `Sakthan Stand
Punkunnam
Amala
Kechery
Choondal
Kunnamkulam
Chowalloorpady
Guruvayur`
  },
  {
    routeId: "PB002",
    routeName: "Thrissur-Chavakkad",
    district: "Thrissur",
    stops: `Sakthan Stand
West Fort
Kanjany
Manaloor
Enamavu
Venkitangu
Mullassery
Engandiyur
Chavakkad`
  },
  {
    routeId: "PB003",
    routeName: "Thrissur-Kunnamkulam",
    district: "Thrissur",
    stops: `Sakthan Stand
Punkunnam
Amala
Kechery
Choondal
Kunnamkulam`
  },
  {
    routeId: "PB004",
    routeName: "Thrissur-Wadakkanchery",
    district: "Thrissur",
    stops: `Sakthan Stand
Mannuthy
Viyyur
Mulankunnathukavu
Wadakkanchery`
  },
  {
    routeId: "PB005",
    routeName: "Thrissur-Kodungallur",
    district: "Thrissur",
    stops: `Sakthan Stand
Ollur
Pudukad
Irinjalakuda
Mathilakam
Kodungallur`
  },
  {
    routeId: "PB006",
    routeName: "Thrissur-Irinjalakuda",
    district: "Thrissur",
    stops: `Sakthan Stand
Ollur
Pudukad
Muriyad
Irinjalakuda`
  },
  {
    routeId: "PB007",
    routeName: "Thrissur-Chalakudy",
    district: "Thrissur",
    stops: `Sakthan Stand
Ollur
Pudukad
Amballur
Chalakudy`
  },
  {
    routeId: "PB008",
    routeName: "Thrissur-Mala",
    district: "Thrissur",
    stops: `Sakthan Stand
Ollur
Pudukad
Kuzhur
Mala`
  },
  {
    routeId: "PB009",
    routeName: "Thrissur-Cherpu",
    district: "Thrissur",
    stops: `Sakthan Stand
Kuriachira
Cherpu`
  },
  {
    routeId: "PB010",
    routeName: "Thrissur-Vadanappally",
    district: "Thrissur",
    stops: `Sakthan Stand
Kanjany
Anthikad
Peringottukara
Thriprayar
Valapad
Vadanappally`
  },
  {
    routeId: "PB011",
    routeName: "Thrissur-Thriprayar",
    district: "Thrissur",
    stops: `Sakthan Stand
Kanjany
Anthikad
Peringottukara
Thriprayar`
  },
  {
    routeId: "PB012",
    routeName: "Thrissur-Nattika",
    district: "Thrissur",
    stops: `Sakthan Stand
Kanjany
Anthikad
Nattika`
  },
  {
    routeId: "PB013",
    routeName: "Thrissur-Kanjany",
    district: "Thrissur",
    stops: `Sakthan Stand
West Fort
Kanjany`
  },
  {
    routeId: "PB014",
    routeName: "Thrissur-Chelakkara",
    district: "Thrissur",
    stops: `Sakthan Stand
Mannuthy
Wadakkanchery
Pazhayannur
Chelakkara`
  },
  {
    routeId: "PB015",
    routeName: "Thrissur-Erumapetty",
    district: "Thrissur",
    stops: `Sakthan Stand
Mannuthy
Wadakkanchery
Erumapetty`
  },
  {
    routeId: "PB016",
    routeName: "Thrissur-Varandarappilly",
    district: "Thrissur",
    stops: `Sakthan Stand
Peechi
Varandarappilly`
  },
  {
    routeId: "PB017",
    routeName: "Thrissur-Peechi",
    district: "Thrissur",
    stops: `Sakthan Stand
Mannuthy
Peechi`
  },
  {
    routeId: "PB018",
    routeName: "Thrissur-Puthukkad",
    district: "Thrissur",
    stops: `Sakthan Stand
Ollur
Puthukkad`
  },
  {
    routeId: "PB019",
    routeName: "Thrissur-Kaipamangalam",
    district: "Thrissur",
    stops: `Sakthan Stand
Cherpu
Perinjanam
Kaipamangalam`
  },
  {
    routeId: "PB020",
    routeName: "Thrissur-Aloor",
    district: "Thrissur",
    stops: `Sakthan Stand
Ollur
Pudukad
Aloor`
  },
];

async function seedRoutes() {
  try {
    console.log("🚌 Seeding routes using bulk method...\n");
    
    const routesCollection = await getRoutesCollectionV2();
    
    // Clear existing routes
    await routesCollection.deleteMany({});
    console.log("✅ Cleared existing routes\n");
    
    let totalInserted = 0;
    
    for (const route of routes) {
      console.log(`📍 Creating route: ${route.routeName}`);
      
      try {
        await bulkCreateRoute(
          route.routeId,
          route.routeName,
          route.district,
          route.stops,
          ADMIN_USER_ID
        );
        
        totalInserted++;
        console.log(`   ✅ Created with ${route.stops.split('\n').filter(s => s.trim()).length} stops\n`);
      } catch (error: any) {
        console.log(`   ⚠️  ${error.message}\n`);
      }
    }
    
    console.log("=" .repeat(50));
    console.log(`✅ Total routes inserted: ${totalInserted}`);
    console.log("=" .repeat(50));
    
    // List all routes
    const allRoutes = await routesCollection.find({}).toArray();
    console.log("\n📊 Routes in database:");
    allRoutes.forEach((route) => {
      console.log(`\n${route.routeId}: ${route.routeName}`);
      console.log(`   Stops: ${route.stops.length}`);
      console.log(`   ${route.stops.join(" → ")}`);
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
