# 🕷️ KSRTC Kerala Scraper Guide

## ✅ YES, YOU CAN SCRAPE KSRTC WEBSITE!

Just like "Bus Evide" app collected **40,157+ routes**, you can too!

---

## 🎯 WHAT YOU'LL GET

- ✅ All KSRTC Kerala government bus routes
- ✅ Bus schedules and timings
- ✅ Route stops
- ✅ Fare information
- ✅ Bus types

---

## 🛠️ SETUP

### **Option 1: Python Scraper** (Easier)

#### **1. Install Dependencies:**
```bash
pip install requests beautifulsoup4
```

#### **2. Run Scraper:**
```bash
python scripts/scrape-ksrtc.py
```

---

### **Option 2: TypeScript Scraper** (Better Integration)

#### **1. Install Dependencies:**
```bash
npm install axios cheerio
npm install --save-dev @types/cheerio
```

#### **2. Add to package.json:**
```json
{
  "scripts": {
    "scrape:ksrtc": "tsx scripts/scrape-ksrtc.ts"
  }
}
```

#### **3. Run Scraper:**
```bash
npm run scrape:ksrtc
```

---

## 📊 HOW IT WORKS

### **Step 1: Inspect KSRTC Website**
```
Visit: https://online.ksrtc.kerala.gov.in
- Check route search functionality
- Inspect HTML structure
- Find API endpoints
```

### **Step 2: Adjust Selectors**
```typescript
// Update these based on actual website structure:
$('.bus-item')        // Bus listing container
$('.bus-number')      // Bus number
$('.departure-time')  // Departure time
$('.route-name')      // Route name
```

### **Step 3: Run Scraper**
```bash
npm run scrape:ksrtc
```

### **Step 4: Import to Database**
```typescript
// The scraper saves to JSON files
// Then import to MongoDB:
import { bulkCreateRoute } from './lib/models-v2';

const routes = JSON.parse(fs.readFileSync('ksrtc_routes.json'));
for (const route of routes) {
  await bulkCreateRoute(route);
}
```

---

## 🎯 SCRAPING STRATEGIES

### **Strategy 1: District-by-District**
```typescript
// Scrape Thrissur district first
await scraper.scrapeDistrictRoutes('Thrissur');

// Then other districts
await scraper.scrapeDistrictRoutes('Ernakulam');
await scraper.scrapeDistrictRoutes('Kozhikode');
```

### **Strategy 2: Major Routes First**
```typescript
const majorRoutes = [
  { from: 'Thrissur', to: 'Kochi' },
  { from: 'Thrissur', to: 'Kozhikode' },
  { from: 'Kochi', to: 'Trivandrum' },
];

for (const route of majorRoutes) {
  await scraper.searchRoute(route.from, route.to);
}
```

### **Strategy 3: Incremental Scraping**
```typescript
// Scrape 100 routes per day
// Avoid overwhelming the server
// Build database gradually
```

---

## ⚠️ IMPORTANT CONSIDERATIONS

### **1. Legal & Ethical** ⚖️
```
✅ DO:
- Respect robots.txt
- Add delays between requests (1-2 seconds)
- Use proper User-Agent
- Don't overload server

❌ DON'T:
- Scrape too aggressively
- Ignore rate limits
- Resell scraped data
- Claim it as official data
```

### **2. Rate Limiting** 🐌
```typescript
// Add delays between requests
await sleep(1000); // 1 second delay

// Scrape during off-peak hours
// 2 AM - 6 AM is best
```

### **3. Data Verification** ✅
```
- Scraped data may have errors
- Still need community verification
- Cross-check with actual routes
- Update regularly
```

---

## 🚀 RECOMMENDED APPROACH

### **Phase 1: Manual (Current)** ✅
```
Week 1-2:
- Add 50 routes manually
- Focus on Thrissur area
- Get community started
```

### **Phase 2: Scrape KSRTC** 🕷️
```
Week 3:
- Run scraper for Thrissur district
- Get ~500-1000 KSRTC routes
- Import to database
- Mark as "needs verification"
```

### **Phase 3: Community Verification** ✅
```
Week 4+:
- Users verify scraped routes
- Fix errors
- Add missing stops
- Community-powered accuracy
```

### **Phase 4: Add Private Buses** 🚌
```
Ongoing:
- KSRTC scraper only gets govt buses
- Users add private bus routes
- Complete coverage
```

---

## 📝 SAMPLE SCRAPER OUTPUT

### **ksrtc_thrissur_kochi.json:**
```json
[
  {
    "busNumber": "FAST-123",
    "departureTime": "06:00 AM",
    "arrivalTime": "08:30 AM",
    "duration": "2h 30m",
    "fare": "₹85",
    "busType": "Fast Passenger"
  },
  {
    "busNumber": "EXP-456",
    "departureTime": "07:00 AM",
    "arrivalTime": "09:15 AM",
    "duration": "2h 15m",
    "fare": "₹95",
    "busType": "Express"
  }
]
```

### **ksrtc_thrissur_routes.json:**
```json
[
  {
    "routeId": "THRISSUR_KOCHI",
    "routeName": "Thrissur - Kochi",
    "from": "Thrissur",
    "to": "Kochi",
    "stops": ["Thrissur", "Chalakudy", "Angamaly", "Aluva", "Kochi"],
    "distance": "75 km",
    "duration": "2h 30m"
  }
]
```

---

## 🎯 INTEGRATION WITH BUSUNDO

### **Import Script:**
```typescript
// scripts/import-ksrtc-data.ts
import { bulkCreateRoute } from '@/lib/models-v2';
import * as fs from 'fs';

async function importKSRTCData() {
  const routes = JSON.parse(
    fs.readFileSync('ksrtc_thrissur_routes.json', 'utf-8')
  );

  for (const route of routes) {
    try {
      await bulkCreateRoute({
        routeId: route.routeId,
        routeName: route.routeName,
        district: 'Thrissur',
        stops: route.stops,
      });
      console.log(`✓ Imported: ${route.routeName}`);
    } catch (error) {
      console.error(`✗ Error: ${route.routeName}`, error);
    }
  }

  console.log('Import completed!');
}

importKSRTCData();
```

---

## 💡 PRO TIPS

### **1. Start Small**
```
- Scrape 10 routes first
- Test import process
- Verify data quality
- Then scale up
```

### **2. Schedule Scraping**
```
- Run scraper weekly
- Update route data
- Catch new routes
- Keep data fresh
```

### **3. Combine Approaches**
```
✅ KSRTC Scraper: Government buses
✅ Manual Entry: Private buses
✅ Community: Verification & updates
= Complete coverage!
```

---

## 🎯 EXPECTED RESULTS

### **Thrissur District:**
```
- ~500-1000 KSRTC routes
- Major routes covered
- Government bus schedules
- Base data for community
```

### **All Kerala:**
```
- ~40,000+ routes (like Bus Evide)
- Takes time to scrape all
- Do district by district
- 1-2 months for full coverage
```

---

## ⚡ QUICK START

### **1. Install Dependencies:**
```bash
npm install axios cheerio
npm install --save-dev @types/cheerio
```

### **2. Test Scraper:**
```bash
npm run scrape:ksrtc
```

### **3. Check Output:**
```bash
cat ksrtc_thrissur_kochi.json
```

### **4. Import to Database:**
```bash
npm run import:ksrtc
```

---

## 🎉 SUMMARY

**YES, YOU CAN SCRAPE KSRTC!** 🕷️

**Benefits:**
- ✅ Get 40,000+ routes quickly
- ✅ Government bus data
- ✅ Automated updates
- ✅ Base for community

**Remember:**
- ⚠️ Scrape responsibly
- ⚠️ Add delays
- ⚠️ Verify data
- ⚠️ Still need community for private buses

**Best Approach:**
```
Manual (50 routes) 
  → Scrape KSRTC (1000 routes)
    → Community verification
      → Add private buses
        → Complete platform!
```

---

**Ready to scrape? Install dependencies and run the scraper! 🚀**
