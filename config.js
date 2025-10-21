/**
 * Clippings Configuration
 *
 * IMPORTANT: Replace the API_URL below with your actual Google Apps Script Web App URL
 *
 * To get your URL:
 * 1. Open Google Apps Script editor
 * 2. Click "Deploy" → "New deployment"
 * 3. Select type: "Web app"
 * 4. Execute as: "Me"
 * 5. Who has access: "Anyone" (or your preference)
 * 6. Click "Deploy"
 * 7. Copy the "Web app URL"
 * 8. Paste it below
 *
 * Example URL format:
 * https://script.google.com/macros/s/AKfycby...../exec
 */

const CONFIG = {
  // Replace this with your actual Google Apps Script Web App URL
  API_URL: 'https://script.google.com/macros/s/AKfycbz8MmgXv4v6OmDDWI-C7f2WL4K9o94dYn9decpxsIyfUfGPtJOdYb7W54t64tMof7l7/exec',

  // API timeout in milliseconds (30 seconds default)
  TIMEOUT: 30000,

  // Enable debug logging to console
  DEBUG: true
};

// Validate configuration on load
if (CONFIG.API_URL === 'https://script.google.com/macros/s/AKfycbz8MmgXv4v6OmDDWI-C7f2WL4K9o94dYn9decpxsIyfUfGPtJOdYb7W54t64tMof7l7/exec' || !CONFIG.API_URL.includes('script.google.com')) {
  console.warn('⚠️ API URL not configured! Please update config.js with your Google Apps Script URL.');
  document.addEventListener('DOMContentLoaded', function() {
    const warning = document.getElementById('configWarning');
    if (warning) {
      warning.style.display = 'block';
    }
  });
}

// Debug helper
function debugLog(...args) {
  if (CONFIG.DEBUG) {
    console.log('[Clippings]', ...args);
  }
}
