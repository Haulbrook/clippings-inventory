# Clippings - Netlify Deployment Guide

## 🎯 Overview

This guide will help you deploy Clippings to Netlify using a **hybrid architecture**:

- **Frontend**: Hosted on Netlify (fast, free static hosting)
- **Backend**: Hosted on Google Apps Script (free, integrated with Google Sheets)

```
[User's Browser]
      ↓
[Netlify - Frontend]
      ↓ (API Calls)
[Google Apps Script - Backend]
      ↓
[Google Sheets - Database]
```

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Google Account (for Google Apps Script)
- ✅ GitHub account (optional, for easier Netlify deployment)
- ✅ Netlify account (free - sign up at netlify.com)
- ✅ Your optimized Clippings code (from the ClippingV2 folder)

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Google Apps Script

#### 1.1 Open Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name it "Clippings Backend"

#### 1.2 Copy Backend Code

1. In the script editor, delete the default `function myFunction() {}`
2. Open `/ClippingV2/Clipping V 2 Codegs.js`
3. Copy **ALL** the code
4. Paste it into the Apps Script editor
5. Click the save icon (💾) or Ctrl/Cmd+S

#### 1.3 Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Fill in the settings:
   - **Description**: "Clippings API"
   - **Execute as**: **"Me"** (your email)
   - **Who has access**: **"Anyone"** ⚠️ Important!
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to Clippings Backend (unsafe)**
9. Click **Allow**
10. **COPY THE WEB APP URL** - it looks like:
    ```
    https://script.google.com/macros/s/AKfycby...../exec
    ```
11. **Save this URL!** You'll need it in Step 2

#### 1.4 Configure Your Sheet IDs

The backend code already has the sheet IDs configured, but verify they're correct:

1. Open your Google Sheet with inventory data
2. Look at the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. Copy the SHEET_ID portion
4. In the Apps Script editor, find the `CONFIG` object at the top
5. Verify the `INVENTORY_SHEET_ID` matches your sheet
6. Do the same for `TRUCK_SHEET_ID` and `KNOWLEDGE_BASE_SHEET_ID`
7. Save the script

---

### Step 2: Configure Frontend

#### 2.1 Update config.js

1. Open `/netlify-deploy/config.js` in a text editor
2. Find this line:
   ```javascript
   API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
   ```
3. Replace it with your actual Web App URL from Step 1.3:
   ```javascript
   API_URL: 'https://script.google.com/macros/s/AKfycby...../exec',
   ```
4. Save the file

#### 2.2 (Optional) Enable Debug Mode

If you want to see API calls in the browser console:

```javascript
DEBUG: true  // Change from false to true
```

---

### Step 3: Deploy to Netlify

You have two options: **Drag & Drop** (easiest) or **Git Integration** (recommended for updates).

#### Option A: Drag & Drop Deployment (Easiest)

1. Go to [netlify.com](https://www.netlify.com)
2. Log in or sign up
3. Click **"Add new site"** → **"Deploy manually"**
4. **Drag the entire `/netlify-deploy` folder** onto the deployment area
5. Wait for deployment to complete (usually 30 seconds)
6. Netlify will give you a URL like: `https://random-name-12345.netlify.app`
7. Click the URL to open your deployed site!

#### Option B: Git Integration (Recommended)

1. Create a new GitHub repository
2. Copy all files from `/netlify-deploy` to your repo
3. Commit and push:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
4. Go to [netlify.com](https://www.netlify.com)
5. Click **"Add new site"** → **"Import an existing project"**
6. Choose **GitHub** and select your repository
7. Settings:
   - **Branch to deploy**: `main`
   - **Build command**: (leave empty)
   - **Publish directory**: `.`
8. Click **"Deploy site"**
9. Netlify will auto-deploy on every git push!

---

### Step 4: Customize Your Domain (Optional)

#### Change Netlify Subdomain

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Enter your preferred name (e.g., `deeproots-inventory`)
4. Your new URL: `https://deeproots-inventory.netlify.app`

#### Use Custom Domain

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Netlify: **Domain management** → **"Add custom domain"**
3. Follow the DNS setup instructions
4. Netlify provides free SSL certificates automatically!

---

## ✅ Verification & Testing

### Test Your Deployment

1. Open your Netlify URL
2. You should see the Clippings interface
3. **Test Search**:
   - Enter a search query (e.g., "mulch")
   - Click "Search"
   - You should see results from your Google Sheet
4. **Test Update**:
   - Go to "Update Inventory" tab
   - Try adding a test item
   - Check your Google Sheet - the item should appear!

### Troubleshooting

#### "API URL not configured" Warning

- ❌ Problem: Yellow warning box at the top
- ✅ Solution: Edit `config.js` and add your Google Apps Script URL

#### "Failed to fetch" or "Network error"

- ❌ Problem: API calls failing
- ✅ Solutions:
  1. Check that your Google Apps Script is deployed as "Anyone can access"
  2. Verify the URL in `config.js` ends with `/exec`
  3. Try accessing the Apps Script URL directly in a browser - it should return a page

#### "Function not allowed" Error

- ❌ Problem: Security error
- ✅ Solution: The function you're calling isn't in the `allowedFunctions` list in `doPost()`
- Check lines 543-552 in the backend code

#### Results not updating

- ❌ Problem: Old cached data showing
- ✅ Solutions:
  1. Clear your browser cache
  2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  3. Wait 20 minutes for cache to expire

---

## 🔄 Making Updates

### Update Frontend (Netlify)

#### If using Drag & Drop:
1. Edit files in `/netlify-deploy`
2. Drag the updated folder to Netlify again
3. New deployment created automatically

#### If using Git Integration:
```bash
git add .
git commit -m "Update description"
git push origin main
```
Netlify auto-deploys in ~1 minute!

### Update Backend (Google Apps Script)

1. Open [script.google.com](https://script.google.com)
2. Find your "Clippings Backend" project
3. Make your changes
4. Save (Ctrl/Cmd+S)
5. **Important**: Click **Deploy** → **Manage deployments**
6. Click the pencil icon ✏️ next to your active deployment
7. Under "Version": Choose **"New version"**
8. Click **Deploy**
9. Changes are live immediately!

---

## 🔒 Security Considerations

### Current Setup (Good for Private Use)

- ✅ Backend URL is hard to guess (long random string)
- ✅ Only allowed functions can be called
- ✅ Input validation prevents SQL injection
- ✅ API key stored securely in Google Properties

### Enhanced Security (For Public Use)

If you want to make this public, consider:

1. **Add Authentication**:
   ```javascript
   // In doPost(), add:
   const apiKey = requestData.apiKey;
   if (apiKey !== 'your-secret-key') {
     return createJSONResponse({ error: 'Unauthorized' }, 401);
   }
   ```

2. **Restrict CORS**:
   ```javascript
   // In createJSONResponse(), add:
   output.addHeader('Access-Control-Allow-Origin', 'https://your-netlify-site.netlify.app');
   ```

3. **Rate Limiting**:
   - Use Google Apps Script quotas (built-in)
   - Or add your own rate limiting logic

---

## 💰 Cost Breakdown

### What's Free:

- ✅ **Netlify**:
  - 100 GB bandwidth/month
  - Unlimited sites
  - Free SSL certificates
  - Auto-deployments

- ✅ **Google Apps Script**:
  - 20,000 URL Fetch calls/day
  - Unlimited script runs
  - Free Google Sheets database

### When You'll Need to Pay:

- **Netlify**: Only if you exceed 100 GB/month (unlikely for this app)
- **Google Apps Script**: Only if you exceed 20,000 API calls/day
- **Custom Domain**: $10-15/year (optional)

**For a small landscaping company: $0/month + optional domain**

---

## 📊 Monitoring & Analytics

### Netlify Analytics (Free)

1. In Netlify, go to **Analytics**
2. See visitor stats, page views, performance

### Google Apps Script Logs

1. Open [script.google.com](https://script.google.com)
2. Open your project
3. Click **Executions** in left sidebar
4. See all API calls, errors, and execution times

### Browser Console (Debug Mode)

1. Enable `DEBUG: true` in `config.js`
2. Open browser DevTools (F12)
3. Go to Console tab
4. See all API calls and responses

---

## 🎨 Customization

### Change Colors

Edit CSS variables in `index.html` (lines 14-25):

```css
:root {
  --cream: #FAF6F2;        /* Background */
  --deep-green: #2c5530;   /* Primary color */
  --lavender: #9B8FB4;     /* Accent color */
  /* ... more colors ... */
}
```

### Change Logo/Title

In `index.html`, find (around line 475):

```html
<h1>
  <span class="flower-accent"></span>
  Clippings  <!-- Change this -->
  <span class="flower-accent"></span>
</h1>
<p class="tagline">Inventory Assistant for Deep Roots Landscape</p>
```

### Add New Features

1. **Frontend**: Edit `app.js`
2. **Backend**: Edit Google Apps Script
3. **Both**: Add to `allowedFunctions` array in `doPost()`

---

## 🆘 Support & Help

### Quick Checklist

Before asking for help, verify:

- [ ] Google Apps Script is deployed as "Anyone can access"
- [ ] `config.js` has the correct URL ending in `/exec`
- [ ] You can access the Apps Script URL directly in a browser
- [ ] Your Google Sheet IDs are correct in the backend `CONFIG`
- [ ] You've waited a few minutes for cache to clear

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Config warning shows | Update `config.js` with your Apps Script URL |
| "Failed to fetch" error | Check Apps Script deployment settings |
| Results not showing | Verify Sheet IDs in backend CONFIG |
| Updates not saving | Check Apps Script Executions log for errors |
| Cache not clearing | Wait 20 minutes or change cache duration |

---

## 🎓 Understanding the Architecture

### How It Works

```
1. User visits Netlify site
   └─> Static HTML/CSS/JS loads instantly

2. User searches for "mulch"
   └─> app.js makes POST request to Google Apps Script
       └─> Backend searches Google Sheets
           └─> Returns JSON data
               └─> Frontend displays results
```

### Why This Architecture?

**Pros:**
- ✅ Fast loading (static hosting)
- ✅ Free hosting (both platforms)
- ✅ Easy updates (just push to Git)
- ✅ Scalable (Netlify CDN + Google infrastructure)
- ✅ Secure (API key protected, input validated)

**Cons:**
- ⚠️ Slightly slower than pure client-side (API roundtrip)
- ⚠️ Requires two deployments (frontend + backend)
- ⚠️ Google Apps Script quotas (20k calls/day)

---

## 📱 Mobile Optimization

The site is already mobile-responsive! Test it:

1. Open your Netlify URL on your phone
2. Or use Chrome DevTools:
   - Press F12
   - Click the phone icon 📱
   - Test different screen sizes

---

## 🚀 Next Steps

After deployment, consider:

1. **Add to Home Screen** (mobile):
   - Make it feel like a native app
   - Add a `manifest.json` file

2. **Set up Monitoring**:
   - Enable Netlify Analytics
   - Monitor Google Apps Script quotas

3. **Train Your Team**:
   - Share the Netlify URL
   - Provide the QUICK_START_GUIDE.md

4. **Regular Backups**:
   - Export inventory CSV weekly
   - Use `exportInventoryCSV()` function

---

## 📄 Files Included

```
netlify-deploy/
├── index.html          # Main interface
├── config.js           # API configuration (EDIT THIS!)
├── app.js              # Application logic
├── netlify.toml        # Netlify settings
├── _redirects          # URL routing
└── NETLIFY_DEPLOYMENT.md # This file
```

---

## ✅ Final Checklist

Before going live:

- [ ] Backend deployed to Google Apps Script
- [ ] Web App URL copied
- [ ] `config.js` updated with URL
- [ ] Frontend deployed to Netlify
- [ ] Tested search functionality
- [ ] Tested update functionality
- [ ] Tested on mobile device
- [ ] Shared URL with team
- [ ] Bookmarked for easy access

---

**🎉 Congratulations! Your Clippings inventory system is now live on the internet!**

**Your Netlify URL**: `https://your-site-name.netlify.app`

**Share it with your team and start managing inventory from anywhere!**

---

*Need help? Check the Troubleshooting section above or review the QUICK_START_GUIDE.md*
