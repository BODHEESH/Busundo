/**
 * Scrape busundo.in data (competitor analysis)
 * They have 1032+ stops already collected
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

interface BusundoRoute {
  routeName: string;
  from: string;
  to: string;
  stops: string[];
  timings?: string[];
}

class BusundoScraper {
  private baseUrl = 'https://busundo.in';
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });
  }

  /**
   * Search for routes between two places
   */
  async searchRoute(from: string, to: string): Promise<BusundoRoute[]> {
    try {
      console.log(`Searching: ${from} → ${to}...`);

      // busundo.in uses a search API
      const response = await this.axiosInstance.get('/api/search', {
        params: {
          from,
          to,
        },
      });

      if (response.status === 200 && response.data) {
        return this.parseRoutes(response.data);
      }

      return [];
    } catch (error) {
      console.error(`Error searching ${from} → ${to}:`, error);
      return [];
    }
  }

  /**
   * Parse routes from API response
   */
  private parseRoutes(data: any): BusundoRoute[] {
    const routes: BusundoRoute[] = [];

    // Adjust based on actual API response structure
    if (Array.isArray(data.routes)) {
      for (const route of data.routes) {
        routes.push({
          routeName: route.name || route.routeName,
          from: route.from || route.source,
          to: route.to || route.destination,
          stops: route.stops || [],
          timings: route.timings || [],
        });
      }
    }

    return routes;
  }

  /**
   * Get all stops from busundo.in
   */
  async getAllStops(): Promise<string[]> {
    try {
      console.log('Fetching all stops from busundo.in...');

      // Try to get stops list (might be in homepage or API)
      const response = await this.axiosInstance.get('/api/stops');

      if (response.status === 200 && response.data) {
        return response.data.stops || [];
      }

      return [];
    } catch (error) {
      console.error('Error fetching stops:', error);
      return [];
    }
  }

  /**
   * Scrape all routes for major Kerala cities
   */
  async scrapeAllRoutes(): Promise<BusundoRoute[]> {
    const allRoutes: BusundoRoute[] = [];

    // Major cities in Kerala
    const cities = [
      'Thiruvananthapuram',
      'Kochi',
      'Kozhikode',
      'Thrissur',
      'Kollam',
      'Palakkad',
      'Alappuzha',
      'Kannur',
      'Kottayam',
      'Malappuram',
      'Ernakulam',
      'Pathanamthitta',
      'Idukki',
      'Wayanad',
    ];

    console.log(`🚌 Scraping routes for ${cities.length} cities...\n`);

    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const from = cities[i];
        const to = cities[j];

        try {
          const routes = await this.searchRoute(from, to);

          if (routes.length > 0) {
            allRoutes.push(...routes);
            console.log(`  ✓ Found ${routes.length} routes`);
          }

          // Rate limiting
          await this.sleep(1000);
        } catch (error) {
          console.error(`  ✗ Error: ${error}`);
        }
      }
    }

    return allRoutes;
  }

  /**
   * Save data to JSON
   */
  saveToJson(data: any, filename: string): void {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✓ Data saved to ${filename}`);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Main scraping function
 */
async function main() {
  const scraper = new BusundoScraper();

  console.log('🕷️ busundo.in Scraper Started...\n');

  try {
    // 1. Get all stops
    console.log('1️⃣ Fetching all stops...');
    const stops = await scraper.getAllStops();
    if (stops.length > 0) {
      console.log(`   Found ${stops.length} stops`);
      scraper.saveToJson(stops, 'busundoin_stops.json');
    }

    // 2. Scrape all routes
    console.log('\n2️⃣ Scraping all routes...');
    const routes = await scraper.scrapeAllRoutes();
    if (routes.length > 0) {
      console.log(`\n   Found ${routes.length} total routes`);
      scraper.saveToJson(routes, 'busundoin_routes.json');
    }

    console.log('\n✅ Scraping completed!');
  } catch (error) {
    console.error('\n❌ Scraping failed:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { BusundoScraper };
