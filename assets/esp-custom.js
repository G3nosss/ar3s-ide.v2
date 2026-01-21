const chipEl = document.getElementById('chip');
const offsetEl = document.getElementById('offset');
const fileEl = document.getElementById('binfile');
const prepareBtn = document.getElementById('prepareBtn');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('installBtn');
const terminalLog = document.getElementById('terminalLog');

// Cleanup delay for blob URLs (1 minute)
const BLOB_CLEANUP_DELAY_MS = 60_000;

// Track current blob URLs for cleanup
let currentManifestUrl = null;
let currentFwUrl = null;

function log(message, type = 'info') {
  if (!terminalLog) return;
  terminalLog.style.display = 'block';
  const timestamp = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.className = type;
  line.textContent = `[${timestamp}] ${message}`;
  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function cleanupBlobUrls() {
  if (currentManifestUrl) {
    try { 
      URL.revokeObjectURL(currentManifestUrl);
      log('Cleaned up manifest blob URL', 'info');
    } catch {}
    currentManifestUrl = null;
  }
  if (currentFwUrl) {
    try { 
      URL.revokeObjectURL(currentFwUrl);
      log('Cleaned up firmware blob URL', 'info');
    } catch {}
    currentFwUrl = null;
  }
}

function parseOffset(hexStr) {
  try {
    if (!hexStr || hexStr.trim() === '') return 0x10000;
    // Always parse as hex - with or without 0x prefix
    if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) {
      return parseInt(hexStr, 16);
    }
    return parseInt(hexStr, 16);
  } catch {
    return 0x10000;
  }
}

prepareBtn?.addEventListener('click', async () => {
  statusEl.textContent = '';
  log('> Initializing flash preparation sequence...', 'info');
  
  // Clean up any existing blob URLs from previous preparations
  cleanupBlobUrls();
  
  const chipFamily = chipEl.value || 'ESP32';
  const file = fileEl.files?.[0];

  if (!file) {
    statusEl.textContent = '❌ Select a .bin file first.';
    log('ERROR: No firmware file selected', 'error');
    return;
  }

  try {
    log(`> Selected chip: ${chipFamily}`, 'info');
    log(`> Firmware file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'info');
    
    currentFwUrl = URL.createObjectURL(file);
    const offset = parseOffset(offsetEl.value);
    log(`> Flash offset: 0x${offset.toString(16).toUpperCase()}`, 'info');

    const manifest = {
      name: "Ar3s Custom Firmware",
      version: "custom",
      build: new Date().toISOString(),
      chipFamily,
      parts: [
        { path: currentFwUrl, offset }
      ]
    };

    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    currentManifestUrl = URL.createObjectURL(manifestBlob);

    installBtn.setAttribute('manifest', currentManifestUrl);
    
    statusEl.textContent = `✅ Ready to flash ${chipFamily} at offset 0x${offset.toString(16)}`;
    log('> Manifest generated successfully', 'success');
    log('> Flash preparation complete. Click Install to begin flashing.', 'success');
    log('━'.repeat(60), 'info');

    // Monitor flashing events
    installBtn.addEventListener('state-changed', (e) => {
      const state = e.detail;
      switch(state) {
        case 'PREPARING':
          log('>>> CONNECTING TO DEVICE...', 'info');
          break;
        case 'INSTALLING':
          log('>>> FLASHING FIRMWARE...', 'warning');
          break;
        case 'INSTALLED':
          log('>>> FLASH COMPLETE ✓', 'success');
          log('Device programmed successfully!', 'success');
          break;
        case 'ERROR':
          log('>>> FLASH FAILED ✗', 'error');
          log('Check connection and try again', 'error');
          break;
      }
    });

    // Schedule cleanup after flashing is likely complete
    setTimeout(cleanupBlobUrls, BLOB_CLEANUP_DELAY_MS);
    
  } catch (error) {
    log(`CRITICAL ERROR: ${error.message}`, 'error');
    statusEl.textContent = `❌ Error: ${error.message}`;
  }
});

// WebSerial connection status monitoring
if ('serial' in navigator) {
  log('✓ WebSerial API available', 'success');
  log('System ready for ESP flashing operations', 'info');
  log('━'.repeat(60), 'info');
} else {
  log('✗ WebSerial API not available', 'error');
  log('Please use Chrome or Edge browser with HTTPS', 'warning');
}
