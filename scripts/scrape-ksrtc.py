"""
KSRTC Kerala Bus Route Scraper
Scrapes bus route data from KSRTC Kerala website
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

class KSRTCScraper:
    def __init__(self):
        self.base_url = "https://online.ksrtc.kerala.gov.in"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    def get_all_routes(self):
        """
        Scrape all available bus routes
        """
        routes = []
        
        # KSRTC website structure may vary
        # You'll need to inspect the actual website and adjust selectors
        
        try:
            # Example: Get route search page
            response = self.session.get(f"{self.base_url}/oprs-web/guest/home.do")
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find route elements (adjust selectors based on actual website)
                route_elements = soup.find_all('div', class_='route-item')
                
                for element in route_elements:
                    route = self.parse_route(element)
                    if route:
                        routes.append(route)
                        
            return routes
            
        except Exception as e:
            print(f"Error scraping routes: {e}")
            return []
    
    def search_route(self, from_place, to_place, date=None):
        """
        Search for specific route between two places
        """
        if not date:
            date = datetime.now().strftime("%d/%m/%Y")
            
        try:
            # KSRTC search endpoint (adjust based on actual API)
            search_url = f"{self.base_url}/oprs-web/guest/searchBus.do"
            
            payload = {
                'fromPlaceName': from_place,
                'toPlaceName': to_place,
                'journeyDate': date,
            }
            
            response = self.session.post(search_url, data=payload)
            
            if response.status_code == 200:
                return self.parse_search_results(response.content)
                
        except Exception as e:
            print(f"Error searching route: {e}")
            return None
    
    def parse_route(self, element):
        """
        Parse route information from HTML element
        """
        try:
            route = {
                'route_id': element.get('data-route-id', ''),
                'route_name': element.find('span', class_='route-name').text.strip(),
                'from': element.find('span', class_='from').text.strip(),
                'to': element.find('span', class_='to').text.strip(),
                'stops': [],
                'distance': element.find('span', class_='distance').text.strip(),
                'duration': element.find('span', class_='duration').text.strip(),
            }
            
            # Get stops if available
            stops_container = element.find('div', class_='stops')
            if stops_container:
                stops = stops_container.find_all('span', class_='stop')
                route['stops'] = [stop.text.strip() for stop in stops]
            
            return route
            
        except Exception as e:
            print(f"Error parsing route: {e}")
            return None
    
    def parse_search_results(self, html_content):
        """
        Parse search results from KSRTC response
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        results = []
        
        # Adjust selectors based on actual website structure
        bus_items = soup.find_all('div', class_='bus-item')
        
        for item in bus_items:
            bus = {
                'bus_number': item.find('span', class_='bus-number').text.strip(),
                'departure_time': item.find('span', class_='departure').text.strip(),
                'arrival_time': item.find('span', class_='arrival').text.strip(),
                'duration': item.find('span', class_='duration').text.strip(),
                'fare': item.find('span', class_='fare').text.strip(),
                'bus_type': item.find('span', class_='bus-type').text.strip(),
            }
            results.append(bus)
        
        return results
    
    def get_route_details(self, route_id):
        """
        Get detailed information about a specific route
        """
        try:
            url = f"{self.base_url}/oprs-web/guest/routeDetails.do?routeId={route_id}"
            response = self.session.get(url)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Parse route details
                details = {
                    'route_id': route_id,
                    'stops': [],
                    'timings': [],
                    'fare_details': [],
                }
                
                # Get stops
                stops_table = soup.find('table', class_='stops-table')
                if stops_table:
                    rows = stops_table.find_all('tr')
                    for row in rows[1:]:  # Skip header
                        cols = row.find_all('td')
                        if len(cols) >= 2:
                            details['stops'].append({
                                'name': cols[0].text.strip(),
                                'arrival': cols[1].text.strip() if len(cols) > 1 else '',
                                'departure': cols[2].text.strip() if len(cols) > 2 else '',
                            })
                
                return details
                
        except Exception as e:
            print(f"Error getting route details: {e}")
            return None
    
    def save_to_json(self, data, filename):
        """
        Save scraped data to JSON file
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")


def main():
    """
    Main scraping function
    """
    scraper = KSRTCScraper()
    
    print("Starting KSRTC Kerala scraper...")
    
    # Example 1: Search specific route
    print("\n1. Searching Thrissur to Kochi route...")
    results = scraper.search_route("Thrissur", "Kochi")
    if results:
        print(f"Found {len(results)} buses")
        scraper.save_to_json(results, 'ksrtc_thrissur_kochi.json')
    
    # Example 2: Get all routes (if available)
    print("\n2. Getting all routes...")
    all_routes = scraper.get_all_routes()
    if all_routes:
        print(f"Found {len(all_routes)} routes")
        scraper.save_to_json(all_routes, 'ksrtc_all_routes.json')
    
    # Example 3: Get route details
    print("\n3. Getting route details...")
    # You'll need actual route IDs from the website
    # details = scraper.get_route_details('ROUTE_ID_HERE')
    
    print("\nScraping completed!")


if __name__ == "__main__":
    main()
