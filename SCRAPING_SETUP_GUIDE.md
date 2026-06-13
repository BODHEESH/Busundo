# 🕷️ COMPLETE SCRAPING SETUP GUIDE

## 🎯 GOAL: Scrape 40,157+ Routes for Busundo.com

---

## ✅ STEP 1: INSTALL DEPENDENCIES

```bash
# Install scraping libraries
npm install axios cheerio
npm install --save-dev @types/cheerio
```

**What this does:**
- `axios` - HTTP client for making requests
- `cheerio` - Parse HTML (like jQuery for Node.js)
- `@types/cheerio` - TypeScript types

---

## ✅ STEP 2: AVAILABLE SCRAPERS

### **1. KSRTC Kerala Scraper** 🚌
**File:** `scripts/scrape-ksrtc.ts`

**What it scrapes:**
- KSRTC government bus routes
- Bus schedules and timings
- Route stops
- ~40,000+ routes (all Kerala)

**Run:**
```bash
npm run scrape:ksrtc
```

**Output:**
- `ksrtc_all_routes.json` - All routes
- `ksrtc_thrissur_routes.json` - Thrissur routes

---

### **2. busundo.in Scraper** 🕷️
**File:** `scripts/scrape-busundoin.ts`

**What it scrapes:**
- busundo.in competitor data
- 1032+ stops already collected
- Community-contributed routes
- Verified route data

**Run:**
```bash
npm run scrape:busundoin
```

**Output:**
- `busundoin_stops.json` - All stops
- `busundoin_routes.json` - All routes

---

### **3. Import Script** 📥
**File:** `scripts/import-ksrtc-data.ts`

**What it does:**
- Imports scraped JSON data to MongoDB
- Auto-creates missing stops
- Bulk route creation

**Run:**
```bash
npm run import:ksrtc
```

---

## 🚀 STEP 3: COMPLETE SCRAPING WORKFLOW

### **Option 1: Quick Start (Recommended)**

```bash
# 1. Install dependencies
npm install

# 2. Run all scrapers + import
npm run scrape:all
```

**This will:**
1. Scrape KSRTC Kerala data
2. Scrape busundo.in data
3. Import everything to database

**Time:** 2-4 hours (depending on network)

---

### **Option 2: Step by Step**

```bash
# 1. Install dependencies
npm install

# 2. Scrape KSRTC data
npm run scrape:ksrtc

# 3. Scrape busundo.in data
npm run scrape:busundoin

# 4. Import to database
npm run import:ksrtc
```

---

## 📊 EXPECTED RESULTS

### **After Scraping:**

**KSRTC Data:**
```
✅ 40,000+ routes
✅ All Kerala coverage
✅ Government bus schedules
✅ Timing information
```

**busundo.in Data:**
```
✅ 1,032+ stops
✅ Community-verified routes
✅ Private bus routes
✅ Local route knowledge
```

**Combined:**
```
✅ 40,000+ routes total
✅ 1,000+ unique stops
✅ Government + Private buses
✅ Complete Kerala coverage
```

---

## 🎯 WHAT HAPPENS AFTER IMPORT

### **Your Database Will Have:**

**Before:**
- 68 stops
- 20 routes

**After:**
- 1,000+ stops ✅
- 40,000+ routes ✅

**Result:**
- **BETTER than busundo.in** (they have 1032 stops)
- **BETTER than Bus Evide** (they have 40,157 routes)
- **SAME data + YOUR unique features!**

---

## ⚠️ IMPORTANT NOTES

### **1. Legal & Ethical**
```
✅ DO:
- Add delays between requests (1-2 seconds)
- Respect robots.txt
- Scrape during off-peak hours
- Use proper User-Agent

❌ DON'T:
- Overload servers
- Scrape aggressively
- Ignore rate limits
```

### **2. Rate Limiting**
```typescript
// Built-in delays in scrapers
await sleep(1000); // 1 second between requests

// Scrape during off-peak hours
// 2 AM - 6 AM is best
```

### **3. Data Quality**
```
⚠️ Scraped data may have errors
✅ Still need community verification
✅ Use your 5+ approval system
✅ Let users fix mistakes
```

---

## 🔧 TROUBLESHOOTING

### **Error: Cannot find module 'axios'**
```bash
# Solution: Install dependencies
npm install axios cheerio
npm install --save-dev @types/cheerio
```

### **Error: KSRTC website not responding**
```bash
# Solution: Try again later
# KSRTC website may be down
# Or scrape busundo.in instead
npm run scrape:busundoin
```

### **Error: Import failed**
```bash
# Solution: Check MongoDB connection
# Make sure .env.local has MONGODB_URI
# Test with: npm run dev
```

---

## 📈 SCRAPING STRATEGY

### **Phase 1: Quick Win (Day 1)**
```bash
# Scrape busundo.in first
npm run scrape:busundoin

# Import to database
npm run import:ksrtc

# Result: 1,000+ stops instantly
```

### **Phase 2: Complete Data (Week 1)**
```bash
# Scrape KSRTC Kerala
npm run scrape:ksrtc

# Import to database
npm run import:ksrtc

# Result: 40,000+ routes
```

### **Phase 3: Verification (Week 2+)**
```bash
# Let community verify
# Fix errors
# Add missing routes
# Community-powered accuracy
```

---

## 🎯 CUSTOMIZATION

### **Scrape Specific District:**

Edit `scripts/scrape-ksrtc.ts`:

```typescript
// Change this line:
const thrissurRoutes = await scraper.scrapeDistrictRoutes('Thrissur');

// To scrape other districts:
const ernakulamRoutes = await scraper.scrapeDistrictRoutes('Ernakulam');
const kozhikodeRoutes = await scraper.scrapeDistrictRoutes('Kozhikode');
```

### **Scrape Specific Routes:**

```typescript
// Add your own routes
const routes = [
  { from: 'Mullassery', to: 'Infopark' },
  { from: 'Thrissur', to: 'Kochi' },
  { from: 'Chavakkad', to: 'Guruvayur' },
];

for (const route of routes) {
  await scraper.searchRoute(route.from, route.to);
}
```

---

## 📊 MONITORING PROGRESS

### **Check Scraped Files:**
```bash
# List JSON files
ls *.json

# Check file sizes
dir *.json

# View sample data
type ksrtc_thrissur_routes.json | more
```

### **Check Database:**
```bash
# Start dev server
npm run dev

# Visit admin dashboard
http://localhost:3001/admin

# Check routes count
http://localhost:3001/admin/routes
```

---

## 🎉 SUCCESS CHECKLIST

After scraping, you should have:

- ✅ `ksrtc_all_routes.json` file
- ✅ `ksrtc_thrissur_routes.json` file
- ✅ `busundoin_stops.json` file
- ✅ `busundoin_routes.json` file
- ✅ 1,000+ stops in database
- ✅ 40,000+ routes in database
- ✅ Data visible in admin dashboard

---

## 🚀 NEXT STEPS AFTER SCRAPING

### **1. Verify Data Quality**
```
- Check random routes
- Test search functionality
- Fix obvious errors
- Mark as "needs verification"
```

### **2. Enable Community Verification**
```
- Users verify routes
- 5+ approvals = verified
- Fix errors together
- Community-powered accuracy
```

### **3. Add Missing Features**
```
- Map view
- Malayalam support
- Filters
- Better UI
```

### **4. Launch & Market**
```
- SEO optimization
- Social media
- College partnerships
- Word of mouth
```

---

## 💡 PRO TIPS

### **1. Scrape in Batches**
```bash
# Day 1: Thrissur district
npm run scrape:ksrtc

# Day 2: Ernakulam district
# Edit scraper, run again

# Day 3: Kozhikode district
# Edit scraper, run again
```

### **2. Backup Scraped Data**
```bash
# Copy JSON files to backup folder
mkdir backup
copy *.json backup\
```

### **3. Schedule Scraping**
```bash
# Run scraper weekly
# Update route data
# Catch new routes
# Keep data fresh
```

---

## 🎯 FINAL COMMAND

### **To scrape everything:**

```bash
# 1. Install dependencies
npm install

# 2. Run all scrapers + import
npm run scrape:all

# 3. Check results
npm run dev
# Visit: http://localhost:3001/admin/routes
```

---

## ✅ SUMMARY

**What You'll Get:**
- 40,000+ KSRTC routes
- 1,000+ bus stops
- Community-verified data
- Complete Kerala coverage

**Time Required:**
- Setup: 5 minutes
- Scraping: 2-4 hours
- Import: 10-30 minutes
- **Total: ~4-5 hours**

**Result:**
- **BETTER data than busundo.in**
- **SAME data as Bus Evide**
- **PLUS your unique features!**

---

**Ready to scrape? Run: `npm install && npm run scrape:all` 🚀**
