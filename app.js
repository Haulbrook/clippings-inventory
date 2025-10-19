/**
 * Clippings - Main Application Logic
 * Handles all frontend interactions and API calls
 */

// Global state
let currentAction = '';

// =============================
// API Communication Layer
// =============================

/**
 * Call the Google Apps Script backend
 * @param {string} functionName - Name of the server function to call
 * @param {*} params - Parameters to pass to the function
 * @returns {Promise} Response from the server
 */
async function callAPI(functionName, params) {
  debugLog(`Calling API: ${functionName}`, params);

  if (CONFIG.API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    throw new Error('API URL not configured. Please update config.js');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

  try {
    // Use GET with query parameters to avoid CORS preflight
    const url = new URL(CONFIG.API_URL);
    url.searchParams.append('function', functionName);
    url.searchParams.append('parameters', JSON.stringify(params));

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    debugLog(`API Response from ${functionName}:`, data);

    // Check for error in response
    if (data.error) {
      throw new Error(data.error);
    }

    return data.result;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    console.error(`API Error (${functionName}):`, error);
    throw error;
  }
}

// =============================
// Tab Management
// =============================

function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(t => t.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));

  const tabIndex = {'search': 0, 'update': 1, 'batch': 2, 'duplicates': 3}[tab];
  tabs[tabIndex].classList.add('active');
  document.getElementById(tab + 'Tab').classList.add('active');
}

// =============================
// Search Functionality
// =============================

async function search() {
  const query = document.getElementById("query").value.trim();
  const resultDiv = document.getElementById("result");
  const searchBtn = document.getElementById("searchBtn");

  // Validate input
  if (!query) {
    resultDiv.innerHTML = '<div class="content-card"><div class="error">Please enter a search term.</div></div>';
    return;
  }

  // Show loading state
  resultDiv.innerHTML = '<div class="content-card"><div class="loading">🌸 Searching through the garden...</div></div>';
  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await callAPI('askInventory', query);
    displayResults(response);
  } catch (error) {
    resultDiv.innerHTML = `<div class="content-card"><div class="error">❌ Error: ${error.message}</div></div>`;
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

function displayResults(response) {
  const resultDiv = document.getElementById("result");

  if (!response || !response.answer) {
    resultDiv.innerHTML = '<div class="content-card"><div class="error">No results found. Please try a different search.</div></div>';
    return;
  }

  // Parse the response to format inventory items nicely
  if (response.source === 'inventory') {
    // Format inventory response
    const lines = response.answer.split('\n').filter(line => line.trim());
    let html = '<div class="content-card"><h3 style="color: var(--lavender-dark); font-family: \'Playfair Display\', serif;">📦 Inventory Results</h3></div>';

    lines.forEach(line => {
      if (line.includes('Quantity:')) {
        // Parse inventory line
        const itemMatch = line.match(/[•⚠️✓✗]\s*(.+?):\s*Quantity:\s*(\d+)\s*(\w+)/);
        const locationMatch = line.match(/Location:\s*([^•]+)/);
        const notesMatch = line.match(/Notes:\s*(.+)/);
        const lowStockMatch = line.includes('⚠️');

        if (itemMatch) {
          html += '<div class="inventory-item">';
          if (lowStockMatch) {
            html += `<strong>⚠️ ${itemMatch[1]}</strong>`;
          } else {
            html += `<strong>${itemMatch[1]}</strong>`;
          }
          html += '<div class="item-details">';
          html += `<span>📊 Quantity: ${itemMatch[2]} ${itemMatch[3]}</span>`;
          if (locationMatch) {
            html += `<span>📍 ${locationMatch[1].trim()}</span>`;
          }
          if (notesMatch) {
            html += `<br><span>📝 ${notesMatch[1]}</span>`;
          }
          html += '</div></div>';
        }
      }
    });

    if (!html.includes('inventory-item')) {
      // Fallback for different format
      html = `<div class="content-card"><pre style="white-space: pre-wrap; font-family: 'Source Sans Pro', sans-serif;">${response.answer}</pre></div>`;
    }

    html += '<div class="source-info">Source: Inventory Database</div>';
    resultDiv.innerHTML = html;
  } else if (response.source === 'trucks') {
    // Format truck response
    let html = '<div class="content-card">';
    html += '<h3 style="color: var(--lavender-dark); font-family: \'Playfair Display\', serif;">🚛 Fleet Information</h3>';
    html += `<pre style="white-space: pre-wrap; font-family: 'Source Sans Pro', sans-serif;">${response.answer}</pre>`;
    html += '<div class="source-info">Source: Fleet Database</div>';
    html += '</div>';
    resultDiv.innerHTML = html;
  } else {
    // Knowledge base or AI response
    let html = '<div class="content-card"><div style="white-space: pre-wrap;">' + response.answer + '</div>';
    html += `<div class="source-info">Source: ${response.source === 'knowledge' ? 'Knowledge Base' : response.source === 'ai' ? 'AI Assistant' : 'System'}</div></div>`;
    resultDiv.innerHTML = html;
  }
}

// =============================
// Update Inventory Functionality
// =============================

function setAction(action) {
  currentAction = action;

  // Update selected card
  document.querySelectorAll('.action-card').forEach(card => {
    card.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');

  // Show form
  document.getElementById('updateForm').style.display = 'block';

  // Reset form
  document.getElementById('itemName').value = '';
  document.getElementById('quantity').value = '1';
  document.getElementById('unit').value = '';
  document.getElementById('location').value = '';
  document.getElementById('notes').value = '';

  // Show/hide relevant fields
  const quantityGroup = document.getElementById('quantityGroup');
  const minStockGroup = document.getElementById('minStockGroup');
  const locationGroup = document.getElementById('locationGroup');
  const notesGroup = document.getElementById('notesGroup');
  const reasonGroup = document.getElementById('reasonGroup');
  const executeBtn = document.getElementById('executeBtn');

  if (action === 'add') {
    quantityGroup.style.display = 'block';
    minStockGroup.style.display = 'block';
    locationGroup.style.display = 'block';
    notesGroup.style.display = 'block';
    reasonGroup.style.display = 'none';
    executeBtn.textContent = 'Add to Inventory';
    executeBtn.className = '';
  } else if (action === 'subtract') {
    quantityGroup.style.display = 'block';
    minStockGroup.style.display = 'none';
    locationGroup.style.display = 'none';
    notesGroup.style.display = 'none';
    reasonGroup.style.display = 'block';
    executeBtn.textContent = 'Remove from Inventory';
    executeBtn.className = 'danger-button';
  } else if (action === 'update') {
    quantityGroup.style.display = 'none';
    minStockGroup.style.display = 'block';
    locationGroup.style.display = 'block';
    notesGroup.style.display = 'block';
    reasonGroup.style.display = 'none';
    executeBtn.textContent = 'Update Item Info';
    executeBtn.className = '';
  }
}

async function executeUpdate() {
  const itemName = document.getElementById('itemName').value.trim();
  const quantity = document.getElementById('quantity').value;
  const unit = document.getElementById('unit').value;
  const location = document.getElementById('location').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const reason = document.getElementById('reason').value;
  const updateResult = document.getElementById('updateResult');
  const executeBtn = document.getElementById('executeBtn');

  if (!itemName) {
    updateResult.innerHTML = '<div class="error">Please enter an item name.</div>';
    return;
  }

  if ((currentAction === 'add' || currentAction === 'subtract') && !unit) {
    updateResult.innerHTML = '<div class="error">Please select a unit.</div>';
    return;
  }

  // Show loading
  updateResult.innerHTML = '<div class="loading">🌸 Updating inventory...</div>';
  executeBtn.disabled = true;

  // Prepare update data
  const updateData = {
    action: currentAction,
    itemName: itemName,
    quantity: parseInt(quantity),
    unit: unit,
    location: location,
    notes: notes,
    reason: reason,
    minStock: parseInt(document.getElementById('minStock').value) || 10
  };

  try {
    const response = await callAPI('updateInventory', updateData);

    if (response.success) {
      updateResult.innerHTML = `<div class="success">${response.message}</div>`;
      // Clear form
      document.getElementById('itemName').value = '';
      document.getElementById('quantity').value = '1';
      document.getElementById('unit').value = '';
      document.getElementById('location').value = '';
      document.getElementById('notes').value = '';
    } else {
      updateResult.innerHTML = `<div class="error">${response.message}</div>`;
    }
  } catch (error) {
    updateResult.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  } finally {
    executeBtn.disabled = false;
  }
}

// =============================
// Batch Import Functionality
// =============================

async function performBatchImport() {
  const batchData = document.getElementById('batchData').value.trim();
  const resultDiv = document.getElementById('batchResult');

  if (!batchData) {
    resultDiv.innerHTML = '<div class="content-card"><div class="error">Please enter items to import.</div></div>';
    return;
  }

  // Show loading
  resultDiv.innerHTML = '<div class="content-card"><div class="loading">🌸 Importing items...</div></div>';

  try {
    const response = await callAPI('batchImportItems', batchData);

    if (response.success) {
      let html = '<div class="content-card">';
      html += `<div class="success">${response.summary}</div>`;

      if (response.results && response.results.length > 0) {
        html += '<div style="margin-top: 20px;">';
        html += '<h4>Import Details:</h4>';

        response.results.forEach(result => {
          if (result.success) {
            html += `<div style="color: var(--deep-green); margin: 5px 0;">✓ ${result.message}</div>`;
          } else {
            html += `<div style="color: #D08B5B; margin: 5px 0;">✗ ${result.line} - ${result.message}</div>`;
          }
        });
        html += '</div>';
      }

      html += '</div>';
      resultDiv.innerHTML = html;

      // Clear the textarea if all successful
      if (response.results.every(r => r.success)) {
        document.getElementById('batchData').value = '';
      }
    } else {
      resultDiv.innerHTML = `<div class="content-card"><div class="error">${response.message}</div></div>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<div class="content-card"><div class="error">Error: ${error.message}</div></div>`;
  }
}

// =============================
// Duplicate Detection Functionality
// =============================

async function scanForDuplicates() {
  const resultDiv = document.getElementById('duplicatesResult');

  // Show loading
  resultDiv.innerHTML = '<div class="content-card"><div class="loading">🔍 Scanning for duplicates...</div></div>';

  try {
    const response = await callAPI('findDuplicates', null);

    if (response.success) {
      if (response.duplicates && response.duplicates.length > 0) {
        let html = '<div class="content-card">';
        html += `<h4>Found ${response.duplicates.length} potential duplicate${response.duplicates.length > 1 ? 's' : ''}:</h4>`;
        html += '</div>';

        response.duplicates.forEach((dup, index) => {
          // Escape quotes for onclick attributes
          const item1Escaped = dup.item1.name.replace(/'/g, "\\'");
          const item2Escaped = dup.item2.name.replace(/'/g, "\\'");

          html += `
            <div class="content-card" id="dup-${index}" style="border-left: 4px solid var(--coral);">
              <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 20px;">
                <div style="flex: 1; min-width: 300px;">
                  <h4 style="color: var(--lavender-dark); margin-bottom: 10px;">${dup.similarity}% Similar</h4>
                  <div style="margin-bottom: 10px;">
                    <strong>1:</strong> ${dup.item1.name}<br>
                    <span style="color: #666; font-size: 0.9em;">
                      ${dup.item1.quantity} ${dup.item1.unit} @ ${dup.item1.location} (Row ${dup.item1.row})
                    </span>
                  </div>
                  <div>
                    <strong>2:</strong> ${dup.item2.name}<br>
                    <span style="color: #666; font-size: 0.9em;">
                      ${dup.item2.quantity} ${dup.item2.unit} @ ${dup.item2.location} (Row ${dup.item2.row})
                    </span>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; min-width: 150px;">
                  <button onclick="mergeDuplicateItems('${item1Escaped}', '${item2Escaped}', true, ${index})">
                    Keep First
                  </button>
                  <button onclick="mergeDuplicateItems('${item1Escaped}', '${item2Escaped}', false, ${index})">
                    Keep Second
                  </button>
                  <button class="danger-button" onclick="ignoreDuplicate(${index})">
                    Keep Both
                  </button>
                </div>
              </div>
            </div>
          `;
        });

        resultDiv.innerHTML = html;
      } else {
        resultDiv.innerHTML = '<div class="content-card"><div class="success">✓ No duplicates found! Your inventory is clean.</div></div>';
      }
    } else {
      resultDiv.innerHTML = `<div class="content-card"><div class="error">${response.message}</div></div>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<div class="content-card"><div class="error">Error: ${error.message}</div></div>`;
  }
}

async function mergeDuplicateItems(item1, item2, keepFirst, index) {
  const button = event.target;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Merging...';

  try {
    const response = await callAPI('mergeDuplicates', {
      item1Name: item1,
      item2Name: item2,
      keepFirst: keepFirst
    });

    if (response.success) {
      // Hide this duplicate card
      const dupCard = document.getElementById(`dup-${index}`);
      if (dupCard) {
        dupCard.style.display = 'none';
      }

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'content-card';
      successDiv.innerHTML = `<div class="success">${response.message}</div>`;
      dupCard.parentNode.insertBefore(successDiv, dupCard);
    } else {
      alert('Error: ' + response.message);
      button.disabled = false;
      button.textContent = originalText;
    }
  } catch (error) {
    alert('Error: ' + error.message);
    button.disabled = false;
    button.textContent = originalText;
  }
}

function ignoreDuplicate(index) {
  const dupCard = document.getElementById(`dup-${index}`);
  if (dupCard) {
    dupCard.style.display = 'none';
  }
}

// =============================
// Initialization
// =============================

// Focus on search input when page loads
window.addEventListener('DOMContentLoaded', function() {
  const queryInput = document.getElementById("query");
  if (queryInput) {
    queryInput.focus();
  }

  debugLog('Clippings initialized');
  debugLog('API URL:', CONFIG.API_URL);
});
