// Enhanced ESP Custom Flasher with hacker-style logging and better error handling
const chipEl = document.getElementById('chip');
const offsetEl = document.getElementById('offset');
const fileEl = document.getElementById('binfile');
const prepareBtn = document.getElementById('prepareBtn');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('installBtn');
const terminalLog = document.getElementById('terminalLog');
const logContent = document.getElementById('logContent');

// Cleanup delay for blob URLs (1 minute)
const BLOB_CLEANUP_DELAY_MS = 60_000;

// Track current blob URLs for cleanup
let currentManifestUrl = null;
let currentFwUrl = null;

// Logger utility
const logger = {
  log: (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `terminal-line ${type === 'error' ? 'terminal-error' : type === 'success' ? 'terminal-success' : type === 'warning' ? 'terminal-warning' : ''}`;
    line.textContent = `[${timestamp}] ${message}`;
    logContent.appendChild(line);
    terminalLog.style.display = 'block';
    terminalLog.scrollTop = terminalLog.scrollHeight;
  },
  
  clear: () => {
    logContent.innerHTML = '';
    terminalLog.style.display = 'none';
  },
  
  info: (msg) => logger.log(msg, 'info'),
  success: (msg) => logger.log(msg, 'success'),
  error: (msg) => logger.log(msg, 'error'),
  warning: (msg) => logger.log(msg, 'warning')
};

function cleanupBlobUrls() {
  if (currentManifestUrl) {
    try { 
      URL.revokeObjectURL(currentManifestUrl);
      logger.info('Manifest blob URL cleaned up');
    } catch {
      // Ignore if already revoked
    }
    currentManifestUrl = null;
  }
  if (currentFwUrl) {
    try { 
      URL.revokeObjectURL(currentFwUrl);
      logger.info('Firmware blob URL cleaned up');
    } catch {
      // Ignore if already revoked
    }
    currentFwUrl = null;
  }
}

function parseOffset(hexStr) {
  try {
    if (!hexStr || hexStr.trim() === '') {
      logger.warning('No offset provided, using default 0x10000');
      return 0x10000;
    }
    // Always parse as hex - with or without 0x prefix
    if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) {
      return parseInt(hexStr, 16);
    }
    return parseInt(hexStr, 16);
  } catch (err) {
    logger.error(`Invalid offset format: ${hexStr}. Using default 0x10000`);
    return 0x10000;
  }
}

// Check if WebSerial is supported
function checkWebSerialSupport() {
  if (!('serial' in navigator)) {
    logger.error('WebSerial API not supported in this browser');
    logger.warning('Please use Chrome or Edge browser');
    return false;
  }
  
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    logger.error('HTTPS required for WebSerial API');
    logger.warning('Please access via https://ar3s.me');
    return false;
  }
  
  logger.success('WebSerial API supported');
  return true;
}

// Validate firmware file
function validateFirmwareFile(file) {
  logger.info(`Validating firmware file: ${file.name}`);
  
  if (!file.name.endsWith('.bin')) {
    logger.error('Invalid file type. Please select a .bin file');
    return false;
  }
  
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  logger.info(`File size: ${sizeMB} MB`);
  
  if (file.size === 0) {
    logger.error('File is empty');
    return false;
  }
  
  if (file.size > 16 * 1024 * 1024) {
    logger.warning(`Large file detected (${sizeMB} MB). Ensure sufficient flash memory`);
  }
  
  logger.success('Firmware file validated successfully');
  return true;
}

prepareBtn?.addEventListener('click', async () => {
  try {
    // Clear previous logs and status
    logger.clear();
    statusEl.textContent = '';
    
    logger.info('=== ESP CUSTOM FLASHER INITIATED ===');
    
    // Check WebSerial support
    if (!checkWebSerialSupport()) {
      statusEl.textContent = 'WebSerial not supported. Use Chrome/Edge with HTTPS.';
      return;
    }
    
    // Clean up any existing blob URLs from previous preparations
    cleanupBlobUrls();
    
    const chipFamily = chipEl.value || 'ESP32';
    const file = fileEl.files?.[0];
    
    if (!file) {
      logger.error('No firmware file selected');
      statusEl.textContent = 'Please select a .bin file first.';
      return;
    }
    
    // Validate firmware file
    if (!validateFirmwareFile(file)) {
      statusEl.textContent = 'Invalid firmware file. Check logs for details.';
      return;
    }
    
    logger.info(`Target chip: ${chipFamily}`);
    
    // Create blob URL for firmware
    logger.info('Creating firmware blob URL...');
    currentFwUrl = URL.createObjectURL(file);
    logger.success('Firmware blob URL created');
    
    const offset = parseOffset(offsetEl.value);
    logger.info(`Flash offset: 0x${offset.toString(16)}`);
    
    // Create manifest
    logger.info('Generating flash manifest...');
    const manifest = {
      name: "AR3S Custom Firmware",
      version: "custom",
      build: new Date().toISOString(),
      chipFamily,
      parts: [
        { path: currentFwUrl, offset }
      ]
    };
    
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    currentManifestUrl = URL.createObjectURL(manifestBlob);
    logger.success('Manifest generated successfully');
    
    // Configure install button
    logger.info('Configuring ESP Web Tools...');
    installBtn.setAttribute('manifest', currentManifestUrl);
    logger.success('Ready to flash!');
    
    statusEl.textContent = `✓ Prepared ${chipFamily} flash at offset 0x${offset.toString(16)}. Click Install to proceed.`;
    statusEl.style.color = 'var(--neon-cyan)';
    
    logger.info('=== PREPARATION COMPLETE ===');
    logger.warning('Click the INSTALL button below to begin flashing');
    
    // Schedule cleanup after flashing is likely complete
    setTimeout(() => {
      cleanupBlobUrls();
      logger.info('=== SESSION CLEANUP COMPLETED ===');
    }, BLOB_CLEANUP_DELAY_MS);
    
  } catch (error) {
    logger.error(`Fatal error: ${error.message}`);
    logger.error(error.stack || 'No stack trace available');
    statusEl.textContent = `Error: ${error.message}`;
    statusEl.style.color = '#ff006e';
  }
});

// Monitor install button events for enhanced logging
if (installBtn) {
  // Listen for custom events from esp-web-tools if available
  installBtn.addEventListener('state-changed', (event) => {
    const state = event.detail?.state;
    if (state) {
      logger.info(`Flasher state: ${state}`);
    }
  });
  
  installBtn.addEventListener('error', (event) => {
    const error = event.detail?.message || 'Unknown error';
    logger.error(`Flash error: ${error}`);
  });
  
  // Add click listener to log when user starts flashing
  installBtn.addEventListener('click', () => {
    logger.info('=== FLASHING INITIATED ===');
    logger.info('Connecting to device...');
  });
}

// Initialize
logger.clear();
logger.info('ESP Custom Flasher loaded');
logger.info('System ready');
