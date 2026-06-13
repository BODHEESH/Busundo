/**
 * Import KSRTC scraped data into Busundo database
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from 'fs';
import * as path from 'path';
import { bulkCreateRoute } from '../lib/models-v2';
import { ObjectId } from 'mongodb';

interface ScrapedRoute {
  routeId: string;
  routeName: string;
  from: string;
  to: string;
  stops: string[];
  distance?: string;
  duration?: string;
}

async function importKSRTCData() {
  console.log('🚌 Starting KSRTC data import...\n');

  try {
    // Check if scraped data files exist
    const routesFile = 'ksrtc_all_routes.json';
    const thrissurFile = 'ksrtc_thrissur_routes.json';

    let routes: ScrapedRoute[] = [];

    // Try to load all routes first
    if (fs.existsSync(routesFile)) {
      console.log(`📂 Loading ${routesFile}...`);
      const data = JSON.parse(fs.readFileSync(routesFile, 'utf-8'));
      routes = data;
      console.log(`   Found ${routes.length} routes\n`);
    } else if (fs.existsSync(thrissurFile)) {
      console.log(`📂 Loading ${thrissurFile}...`);
      const data = JSON.parse(fs.readFileSync(thrissurFile, 'utf-8'));
      routes = data;
      console.log(`   Found ${routes.length} routes\n`);
    } else {
      console.error('❌ No scraped data files found!');
      console.log('   Run: npm run scrape:ksrtc first\n');
      process.exit(1);
    }

    // Import routes
    let imported = 0;
    let errors = 0;

    console.log('📥 Importing routes to database...\n');

    // Temporary user ID for created routes
    const tempUserId = new ObjectId();

    for (const route of routes) {
      try {
        const routeId = route.routeId || `${route.from}-${route.to}`.toUpperCase().replace(/\s/g, '_');
        const routeName = route.routeName || `${route.from} - ${route.to}`;
        const district = 'Thrissur'; // Default to Thrissur, can be enhanced
        const stopsText = (route.stops || [route.from, route.to]).join('\n');

        // Create route using bulkCreateRoute (auto-creates missing stops)
        await bulkCreateRoute(
          routeId,
          routeName,
          district,
          stopsText,
          tempUserId
        );

        imported++;
        console.log(`✓ [${imported}/${routes.length}] ${routeName}`);
      } catch (error: any) {
        errors++;
        console.error(`✗ Error: ${route.routeName || route.from + ' - ' + route.to}`, error.message);
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${imported} routes`);
    console.log(`   ❌ Errors: ${errors} routes`);
    console.log(`   📈 Success Rate: ${((imported / routes.length) * 100).toFixed(1)}%\n`);

    console.log('✅ Import completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
importKSRTCData();
