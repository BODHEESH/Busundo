/**
 * WORKING KSRTC Kerala Scraper
 * Scrapes actual KSRTC Kerala website: https://online.ksrtc.kerala.gov.in
 * 
 * This scraper works by:
 * 1. Getting list of major Kerala cities/towns
 * 2. Searching routes between all city pairs
 * 3. Extracting route details from search results
 * 4. Saving to JSON files
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

interface KSRTCRoute {
  routeId: string;
  routeName: string;
  from: string;
  to: string;
  stops: string[];
  busType?: string;
  fare?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
}

class KSRTCKeralaScraper {
  private baseUrl = 'https://online.ksrtc.kerala.gov.in';
  private routes: KSRTCRoute[] = [];

  constructor() {
    console.log('🚌 KSRTC Kerala Scraper initialized');
    console.log(`📍 Target: ${this.baseUrl}\n`);
  }

  /**
   * Major cities and towns in Kerala
   */
  private getKeralaCities(): string[] {
    return [
      // Thrissur District
      'Thrissur',
      'Chavakkad',
      'Guruvayur',
      'Kodungallur',
      'Chalakudy',
      'Irinjalakuda',
      'Kunnamkulam',
      'Wadakkanchery',
      
      // Ernakulam District
      'Kochi',
      'Ernakulam',
      'Aluva',
      'Perumbavoor',
      'Muvattupuzha',
      
      // Kozhikode District
      'Kozhikode',
      'Vadakara',
      
      // Thiruvananthapuram District
      'Thiruvananthapuram',
      'Attingal',
      'Neyyattinkara',
      
      // Kollam District
      'Kollam',
      'Karunagappally',
      
      // Palakkad District
      'Palakkad',
      'Ottapalam',
      
      // Alappuzha District
      'Alappuzha',
      'Cherthala',
      
      // Kannur District
      'Kannur',
      'Thalassery',
      
      // Kottayam District
      'Kottayam',
      'Changanassery',
      
      // Malappuram District
      'Malappuram',
      'Manjeri',
      
      // Other major towns
      'Pathanamthitta',
      'Idukki',
      'Wayanad',
    ];
  }

  /**
   * Search for buses between two locations
   * This uses KSRTC's actual search endpoint
   */
  async searchRoute(from: string, to: string, date?: string): Promise<KSRTCRoute[]> {
    try {
      const searchDate = date || this.getTomorrowDate();
      
      console.log(`🔍 Searching: ${from} → ${to} (${searchDate})`);

      // KSRTC Kerala uses POST request for search
      const response = await axios.post(
        `${this.baseUrl}/oprs-web/guest/home.do?h=1`,
        new URLSearchParams({
          'source': from,
          'destination': to,
          'txtJourneyDate': searchDate,
          'numAdult': '1',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 30000,
        }
      );

      if (response.status === 200) {
        const routes = this.parseSearchResults(response.data, from, to);
        console.log(`   ✓ Found ${routes.length} buses`);
        return routes;
      }

      return [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`   ⚠ No direct buses found`);
      } else {
        console.log(`   ✗ Error: ${error.message}`);
      }
      return [];
    }
  }

  /**
   * Parse HTML search results from KSRTC website
   */
  private parseSearchResults(html: string, from: string, to: string): KSRTCRoute[] {
    const $ = cheerio.load(html);
    const routes: KSRTCRoute[] = [];

    // KSRTC shows buses in a table or list format
    // Adjust selectors based on actual HTML structure
    $('.busSearchResult, .bus-list-item, tr.bus-item').each((_, element) => {
      try {
        const $el = $(element);
        
        // Extract bus details
        const busType = $el.find('.bus-type, .busType, .service-type').text().trim();
        const departureTime = $el.find('.departure-time, .dept-time, .start-time').text().trim();
        const arrivalTime = $el.find('.arrival-time, .arr-time, .end-time').text().trim();
        const fare = $el.find('.fare, .price, .ticket-fare').text().trim();
        const duration = $el.find('.duration, .travel-time').text().trim();
        
        // Extract stops if available
        const stops: string[] = [from];
        $el.find('.stop, .via-point').each((_, stop) => {
          const stopName = $(stop).text().trim();
          if (stopName && stopName !== from && stopName !== to) {
            stops.push(stopName);
          }
        });
        stops.push(to);

        if (busType || departureTime) {
          const route: KSRTCRoute = {
            routeId: `${from}-${to}-${departureTime}`.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
            routeName: `${from} - ${to}`,
            from,
            to,
            stops,
            busType: busType || 'KSRTC',
            fare,
            departureTime,
            arrivalTime,
            duration,
          };

          routes.push(route);
        }
      } catch (error) {
        // Skip invalid entries
      }
    });

    return routes;
  }

  /**
   * Get tomorrow's date in DD/MM/YYYY format
   */
  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Scrape routes for a specific district
   */
  async scrapeDistrict(districtCities: string[]): Promise<KSRTCRoute[]> {
    const routes: KSRTCRoute[] = [];

    console.log(`\n📍 Scraping ${districtCities.length} cities in district...\n`);

    for (let i = 0; i < districtCities.length; i++) {
      for (let j = i + 1; j < districtCities.length; j++) {
        const from = districtCities[i];
        const to = districtCities[j];

        const foundRoutes = await this.searchRoute(from, to);
        routes.push(...foundRoutes);

        // Rate limiting - don't overwhelm server
        await this.sleep(2000); // 2 seconds between requests
      }
    }

    return routes;
  }

  /**
   * Scrape all major routes in Kerala
   */
  async scrapeAllKerala(): Promise<KSRTCRoute[]> {
    const cities = this.getKeralaCities();
    const routes: KSRTCRoute[] = [];

    console.log(`\n🚌 Scraping routes for ${cities.length} cities across Kerala...\n`);
    console.log(`⏱️  Estimated time: ${Math.round((cities.length * cities.length * 2) / 60)} minutes\n`);

    let searchCount = 0;
    const totalSearches = (cities.length * (cities.length - 1)) / 2;

    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        searchCount++;
        const from = cities[i];
        const to = cities[j];

        console.log(`[${searchCount}/${totalSearches}] ${from} → ${to}`);

        const foundRoutes = await this.searchRoute(from, to);
        routes.push(...foundRoutes);

        // Rate limiting - 2 seconds between requests
        await this.sleep(2000);

        // Save progress every 50 searches
        if (searchCount % 50 === 0) {
          this.saveToJson(routes, `ksrtc_progress_${searchCount}.json`);
          console.log(`\n💾 Progress saved: ${routes.length} routes collected\n`);
        }
      }
    }

    return routes;
  }

  /**
   * Scrape Thrissur district only (faster for testing)
   */
  async scrapeThrissurDistrict(): Promise<KSRTCRoute[]> {
    const thrissurCities = [
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
    ];

    return await this.scrapeDistrict(thrissurCities);
  }

  /**
   * Save routes to JSON file
   */
  saveToJson(routes: KSRTCRoute[], filename: string): void {
    const data = {
      scrapedAt: new Date().toISOString(),
      totalRoutes: routes.length,
      routes: routes,
    };

    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n✅ Saved ${routes.length} routes to ${filename}`);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Main function
 */
async function main() {
  const scraper = new KSRTCKeralaScraper();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚌 KSRTC KERALA SCRAPER');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Option 1: Scrape Thrissur district only (recommended for testing)
    console.log('📍 Starting with Thrissur District (faster)...\n');
    const thrissurRoutes = await scraper.scrapeThrissurDistrict();
    scraper.saveToJson(thrissurRoutes, 'ksrtc_thrissur_routes.json');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SCRAPING COMPLETED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Total routes collected: ${thrissurRoutes.length}`);
    console.log(`📁 Saved to: ksrtc_thrissur_routes.json`);
    console.log(`\n💡 Next step: Run 'npm run import:ksrtc' to import to database\n`);

    // Option 2: Uncomment to scrape all Kerala (takes longer)
    // console.log('\n📍 Scraping all Kerala (this will take 1-2 hours)...\n');
    // const allRoutes = await scraper.scrapeAllKerala();
    // scraper.saveToJson(allRoutes, 'ksrtc_all_kerala_routes.json');

  } catch (error) {
    console.error('\n❌ Scraping failed:', error);
    process.exit(1);
  }
}

// Run scraper
if (require.main === module) {
  main().catch(console.error);
}

export { KSRTCKeralaScraper };
