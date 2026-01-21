const chipEl = document.getElementById('chip');
const offsetEl = document.getElementById('offset');
const fileEl = document.getElementById('binfile');
const prepareBtn = document.getElementById('prepareBtn');
const statusLog = document.getElementById('statusLog');
const installBtn = document.getElementById('installBtn');
const systemIndicator = document.getElementById('systemIndicator');

// Cleanup delay for blob URLs (1 minute)
const BLOB_CLEANUP_DELAY_MS = 60_000;

// Track current blob URLs for cleanup
let currentManifestUrl = null;
let currentFwUrl = null;

// Hacker-style console logging
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-${type}`;
  
  const icon = {
    info: '›',
    success: '✓',
    error: '✗',
    warning: '⚠'
  }[type] || '›';
  
  logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-icon">${icon}</span> ${message}`;
  statusLog?.appendChild(logEntry);
  
  // Auto-scroll to bottom
  if (statusLog) {
    statusLog.scrollTop = statusLog.scrollHeight;
  }
  
  // Update indicator
  if (systemIndicator) {
    systemIndicator.className = 'indicator';
    if (type === 'success') {
      systemIndicator.classList.add('indicator-success');
    } else if (type === 'error') {
      systemIndicator.classList.add('indicator-error');
    } else if (type === 'warning') {
      systemIndicator.classList.add('indicator-warning');
    } else {
      systemIndicator.classList.add('indicator-active');
    }
  }
}

function clearLog() {
  if (statusLog) {
    statusLog.innerHTML = '';
  }
}

function cleanupBlobUrls() {
  if (currentManifestUrl) {
    try { 
      URL.revokeObjectURL(currentManifestUrl);
      log('Revoked manifest blob URL', 'info');
    } catch (err) {
      log(`Failed to revoke manifest URL: ${err.message}`, 'warning');
    }
    currentManifestUrl = null;
  }
  if (currentFwUrl) {
    try { 
      URL.revokeObjectURL(currentFwUrl);
      log('Revoked firmware blob URL', 'info');
    } catch (err) {
      log(`Failed to revoke firmware URL: ${err.message}`, 'warning');
    }
    currentFwUrl = null;
  }
}

function parseOffset(hexStr) {
  try {
    if (!hexStr || hexStr.trim() === '') {
      log('No offset provided, using default 0x10000', 'warning');
      return 0x10000;
    }
    // Always parse as hex - with or without 0x prefix
    const cleanStr = hexStr.trim();
    let value;
    if (cleanStr.startsWith('0x') || cleanStr.startsWith('0X')) {
      value = parseInt(cleanStr, 16);
    } else {
      value = parseInt(cleanStr, 16);
    }
    
    if (isNaN(value)) {
      log(`Invalid offset format: ${hexStr}, using default 0x10000`, 'warning');
      return 0x10000;
    }
    
    log(`Parsed offset: 0x${value.toString(16).toUpperCase()}`, 'info');
    return value;
  } catch (err) {
    log(`Error parsing offset: ${err.message}, using default 0x10000`, 'error');
    return 0x10000;
  }
}

function validateFile(file) {
  if (!file) {
    log('No file selected', 'error');
    return false;
  }
  
  if (!file.name.endsWith('.bin')) {
    log(`Invalid file type: ${file.name}. Expected .bin file`, 'error');
    return false;
  }
  
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  log(`File selected: ${file.name} (${sizeMB} MB)`, 'info');
  
  if (file.size > 10 * 1024 * 1024) {
    log('Warning: File size exceeds 10MB. Flash may take longer', 'warning');
  }
  
  return true;
}

// Check WebSerial API availability
function checkWebSerialSupport() {
  if (!('serial' in navigator)) {
    log('WebSerial API not supported in this browser', 'error');
    log('Please use Chrome/Edge with HTTPS', 'error');
    return false;
  }
  log('WebSerial API detected', 'success');
  return true;
}

prepareBtn?.addEventListener('click', async () => {
  clearLog();
  log('=== INITIATING FLASH PREPARATION ===', 'info');
  
  // Check WebSerial support
  if (!checkWebSerialSupport()) {
    return;
  }
  
  // Clean up any existing blob URLs from previous preparations
  if (currentManifestUrl || currentFwUrl) {
    log('Cleaning up previous session...', 'info');
    cleanupBlobUrls();
  }
  
  const chipFamily = chipEl.value || 'ESP32';
  const file = fileEl.files?.[0];

  if (!validateFile(file)) {
    return;
  }

  try {
    log(`Creating blob URL for firmware...`, 'info');
    currentFwUrl = URL.createObjectURL(file);
    log('Firmware blob URL created', 'success');
    
    const offset = parseOffset(offsetEl.value);

    log(`Building manifest for ${chipFamily}...`, 'info');
    const manifest = {
      name: "Ar3s Custom Firmware",
      version: "custom",
      build: new Date().toISOString(),
      chipFamily,
      parts: [
        { path: currentFwUrl, offset }
      ]
    };

    log('Creating manifest blob...', 'info');
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    currentManifestUrl = URL.createObjectURL(manifestBlob);
    log('Manifest blob created', 'success');

    log('Configuring install button...', 'info');
    installBtn.setAttribute('manifest', currentManifestUrl);
    log('Install button configured', 'success');
    
    log('=== PREPARATION COMPLETE ===', 'success');
    log(`Target: ${chipFamily} @ offset 0x${offset.toString(16).toUpperCase()}`, 'info');
    log('Click the "INSTALL" button below to begin flashing', 'info');

    // Schedule cleanup after flashing is likely complete
    setTimeout(() => {
      log('Scheduling cleanup...', 'info');
      cleanupBlobUrls();
    }, BLOB_CLEANUP_DELAY_MS);
    
  } catch (err) {
    log(`Fatal error during preparation: ${err.message}`, 'error');
    log(`Stack trace: ${err.stack}`, 'error');
    cleanupBlobUrls();
  }
});

// Monitor esp-web-tools events for better logging
if (installBtn) {
  installBtn.addEventListener('state-changed', (e) => {
    const state = e.detail;
    log(`Flash state: ${state}`, 'info');
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  log('ESP Custom Flasher initialized', 'success');
  log('System ready for firmware upload', 'info');
  checkWebSerialSupport();
});
