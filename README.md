# Clippings - Netlify Deployment Package

## 🚀 Quick Start

This folder contains everything you need to deploy Clippings to Netlify.

### **3-Step Deployment**

1. **Deploy backend** to Google Apps Script → Get Web App URL
2. **Update `config.js`** → Paste your Web App URL
3. **Deploy to Netlify** → Drag this folder to netlify.com

**Full instructions**: See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)

---

## 📁 What's In This Folder

| File | Purpose | Edit? |
|------|---------|-------|
| `index.html` | Main application interface | No |
| `app.js` | Frontend application logic | No |
| `config.js` | **API configuration** | **YES - Required!** |
| `netlify.toml` | Netlify build settings | No |
| `_redirects` | URL routing rules | No |
| `NETLIFY_DEPLOYMENT.md` | Complete deployment guide | Read this! |
| `README.md` | This file | - |

---

## ⚡ Super Quick Deploy

If you just want to see it work:

```bash
# 1. Deploy backend and get URL from Google Apps Script

# 2. Edit config.js:
API_URL: 'https://script.google.com/macros/s/YOUR_URL_HERE/exec'

# 3. Drag this entire folder to: app.netlify.com/drop

# Done! Your site is live in 30 seconds.
```

---

## 🔧 Configuration Required

**Before deployment, you MUST:**

1. Open `config.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual URL
3. Save the file

**Example:**
```javascript
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbyXXXXXXXXXXXXXXXX/exec',
  // ... rest of config
};
```

---

## 🌐 Deployment Options

### Option 1: Drag & Drop (Easiest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this folder
3. Done!

### Option 2: Git Integration (Best for Updates)
1. Push this folder to GitHub
2. Connect to Netlify
3. Auto-deploy on every push

---

## 📖 Documentation

- **Complete Guide**: [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)
- **User Guide**: `../QUICK_START_GUIDE.md`
- **Optimization Details**: `../OPTIMIZATION_SUMMARY.md`

---

## 🎯 Architecture

```
Frontend (Netlify)          Backend (Google Apps Script)
    ↓                              ↓
  HTML/CSS/JS            ←→     Code.gs (API)
                                     ↓
                                Google Sheets
```

**Benefits:**
- ✅ Fast (CDN-hosted frontend)
- ✅ Free (both platforms)
- ✅ Secure (validated API)
- ✅ Scalable (cloud infrastructure)

---

## ⚠️ Important Notes

1. **Backend must be deployed first** (to get the URL)
2. **config.js must be edited** before deploying frontend
3. **Backend must allow "Anyone" access** for Netlify to call it
4. **Wait a few minutes** for initial deployment to complete

---

## 🔒 Security

- API key stored securely in Google Apps Script Properties
- Input validation on all requests
- Only allowed functions can be called
- CORS configured for web access

---

## 🆘 Troubleshooting

### Yellow config warning shows
→ Edit `config.js` with your Google Apps Script URL

### "Failed to fetch" errors
→ Check that your Apps Script is deployed as "Anyone can access"

### Results not showing
→ Verify Sheet IDs in backend CONFIG object

---

## 📱 Mobile Friendly

The site is fully responsive and works great on:
- 📱 Mobile phones
- 💻 Tablets
- 🖥️ Desktop computers

---

## 💰 Cost

**$0/month** for typical use:
- Netlify: Free (100GB bandwidth/month)
- Google Apps Script: Free (20k calls/day)
- Optional: Custom domain ($10-15/year)

---

## 🎨 Customization

Want to customize colors, branding, or features?

See the customization section in [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md#-customization)

---

## 🚀 After Deployment

1. **Test everything**:
   - Search functionality
   - Update inventory
   - Batch import
   - Duplicate detection

2. **Bookmark the URL** for your team

3. **Optional**: Set up a custom domain

4. **Share the Quick Start Guide** with users

---

## 📊 What's New in This Version

Compared to the Google Apps Script-hosted version:

- ✅ **Faster loading** (static site on CDN)
- ✅ **Custom domain** support
- ✅ **Better caching** (optimized headers)
- ✅ **Easier updates** (git push or drag & drop)
- ✅ **Same features** (nothing lost!)

---

## 🎓 Learning Resources

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com/)
- **Google Apps Script**: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Markdown Guide**: [markdownguide.org](https://www.markdownguide.org/)

---

## ✅ Deployment Checklist

- [ ] Backend code updated in Google Apps Script
- [ ] Backend deployed as Web App
- [ ] Web App URL copied
- [ ] `config.js` updated with URL
- [ ] Tested API URL in browser
- [ ] Deployed to Netlify
- [ ] Tested on Netlify URL
- [ ] Shared URL with team

---

**Ready to deploy? Start with [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)!**

---

*Made with 💚 for Deep Roots Landscape*
