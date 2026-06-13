/**
 * KSRTC Kerala Bus Route Scraper (TypeScript/Node.js)
 * Scrapes bus route data from KSRTC Kerala website
 * Website: https://online.ksrtc.kerala.gov.in
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

interface BusRoute {
  routeId: string;
  routeName: string;
  from: string;
  to: string;
  stops: string[];
  distance?: string;
  duration?: string;
  busType?: string;
  fare?: string;
}

interface BusSchedule {
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: string;
  busType: string;
  stops?: string[];
}

class KSRTCScraper {
  private baseUrl = 'https://online.ksrtc.kerala.gov.in';
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
   * Search for buses between two places
   */
  async searchRoute(fromPlace: string, toPlace: string, date?: string): Promise<BusSchedule[]> {
    try {
      const journeyDate = date || new Date().toLocaleDateString('en-GB');

      const response = await this.axiosInstance.post('/oprs-web/guest/searchBus.do', {
        fromPlaceName: fromPlace,
        toPlaceName: toPlace,
        journeyDate: journeyDate,
      });

      if (response.status === 200) {
        return this.parseSearchResults(response.data);
      }

      return [];
    } catch (error) {
      console.error(`Error searching route: ${error}`);
      return [];
    }
  }

  /**
   * Parse search results HTML
   */
  private parseSearchResults(html: string): BusSchedule[] {
    const $ = cheerio.load(html);
    const results: BusSchedule[] = [];

    // Adjust selectors based on actual KSRTC website structure
    $('.bus-item, .bus-service').each((_, element) => {
      try {
        const bus: BusSchedule = {
          busNumber: $(element).find('.bus-number, .service-number').text().trim(),
          departureTime: $(element).find('.departure-time, .dept-time').text().trim(),
          arrivalTime: $(element).find('.arrival-time, .arr-time').text().trim(),
          duration: $(element).find('.duration, .travel-time').text().trim(),
          fare: $(element).find('.fare, .price').text().trim(),
          busType: $(element).find('.bus-type, .service-type').text().trim(),
        };

        if (bus.busNumber) {
          results.push(bus);
        }
      } catch (error) {
        console.error('Error parsing bus item:', error);
      }
    });

    return results;
  }

  /**
   * Get all available routes (if endpoint exists)
   */
  async getAllRoutes(): Promise<BusRoute[]> {
    try {
      // This endpoint may not exist - you'll need to find the actual endpoint
      const response = await this.axiosInstance.get('/oprs-web/guest/routes.do');

      if (response.status === 200) {
        return this.parseRoutes(response.data);
      }

      return [];
    } catch (error) {
      console.error(`Error getting all routes: ${error}`);
      return [];
    }
  }

  /**
   * Parse routes from HTML
   */
  private parseRoutes(html: string): BusRoute[] {
    const $ = cheerio.load(html);
    const routes: BusRoute[] = [];

    $('.route-item, .route').each((_, element) => {
      try {
        const route: BusRoute = {
          routeId: $(element).attr('data-route-id') || '',
          routeName: $(element).find('.route-name').text().trim(),
          from: $(element).find('.from, .source').text().trim(),
          to: $(element).find('.to, .destination').text().trim(),
          stops: [],
          distance: $(element).find('.distance').text().trim(),
          duration: $(element).find('.duration').text().trim(),
        };

        // Get stops if available
        $(element).find('.stop').each((_, stop) => {
          const stopName = $(stop).text().trim();
          if (stopName) {
            route.stops.push(stopName);
          }
        });

        if (route.from && route.to) {
          routes.push(route);
        }
      } catch (error) {
        console.error('Error parsing route:', error);
      }
    });

    return routes;
  }

  /**
   * Scrape routes for a specific district
   */
  async scrapeDistrictRoutes(district: string): Promise<BusRoute[]> {
    const routes: BusRoute[] = [];

    // Major cities/towns in the district
    const places = this.getPlacesForDistrict(district);

    console.log(`Scraping routes for ${district}...`);

    for (let i = 0; i < places.length; i++) {
      for (let j = i + 1; j < places.length; j++) {
        const from = places[i];
        const to = places[j];

        console.log(`Searching: ${from} → ${to}`);

        try {
          const schedules = await this.searchRoute(from, to);

          if (schedules.length > 0) {
            // Create route from schedule data
            const route: BusRoute = {
              routeId: `${from}-${to}`.toUpperCase().replace(/\s/g, '_'),
              routeName: `${from} - ${to}`,
              from,
              to,
              stops: [from, to], // Minimal stops, can be enhanced
            };

            routes.push(route);
            console.log(`  ✓ Found ${schedules.length} buses`);
          }

          // Rate limiting - don't overwhelm the server
          await this.sleep(1000);
        } catch (error) {
          console.error(`  ✗ Error: ${error}`);
        }
      }
    }

    return routes;
  }

  /**
   * Get major places for a district
   */
  private getPlacesForDistrict(district: string): string[] {
    const districtPlaces: { [key: string]: string[] } = {
      Thrissur: [
        'Thrissur',
        'Chavakkad',
        'Guruvayur',
        'Kodungallur',
        'Chalakudy',
        'Irinjalakuda',
        'Kunnamkulam',
        'Wadakkanchery',
        'Mullassery',
        'Mala',
      ],
      Ernakulam: [
        'Kochi',
        'Ernakulam',
        'Aluva',
        'Perumbavoor',
        'Muvattupuzha',
        'Kothamangalam',
      ],
      // Add more districts as needed
    };

    return districtPlaces[district] || [];
  }

  /**
   * Save data to JSON file
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
  const scraper = new KSRTCScraper();

  console.log('🚌 KSRTC Kerala Scraper Started...\n');

  // Example 1: Search specific route
  console.log('1️⃣ Searching Thrissur → Kochi...');
  const thrissurKochi = await scraper.searchRoute('Thrissur', 'Kochi');
  if (thrissurKochi.length > 0) {
    console.log(`   Found ${thrissurKochi.length} buses`);
    scraper.saveToJson(thrissurKochi, 'ksrtc_thrissur_kochi.json');
  }

  // Example 2: Scrape all routes for Thrissur district
  console.log('\n2️⃣ Scraping all Thrissur district routes...');
  const thrissurRoutes = await scraper.scrapeDistrictRoutes('Thrissur');
  if (thrissurRoutes.length > 0) {
    console.log(`   Found ${thrissurRoutes.length} routes`);
    scraper.saveToJson(thrissurRoutes, 'ksrtc_thrissur_routes.json');
  }

  console.log('\n✅ Scraping completed!');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { KSRTCScraper };
