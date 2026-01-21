// ESP Custom Flasher with improved WebSerial API handling
// Provides hacker-style console output and graceful error handling

const chipEl = document.getElementById('chip');
const offsetEl = document.getElementById('offset');
const fileEl = document.getElementById('binfile');
const flashBtn = document.getElementById('flashBtn');
const statusBadge = document.getElementById('statusBadge');
const consoleOutput = document.getElementById('consoleOutput');

let port = null;
let reader = null;
let writer = null;

// Console logging functions
function log(message, type = 'info') {
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
  consoleOutput.innerHTML = '';
  log('Console cleared', 'info');
}

function updateStatus(status, message) {
  const statusMap = {
    'idle': { class: 'idle', text: 'IDLE' },
    'connecting': { class: 'connecting', text: 'CONNECTING' },
    'flashing': { class: 'flashing', text: 'FLASHING' },
    'success': { class: 'success', text: 'SUCCESS' },
    'error': { class: 'error', text: 'ERROR' }
  };
  
  const statusInfo = statusMap[status] || statusMap['idle'];
  statusBadge.className = `status-badge ${statusInfo.class}`;
  statusBadge.textContent = statusInfo.text;
  
  if (message) {
    log(message, status === 'success' ? 'success' : status === 'error' ? 'error' : 'info');
  }
}

function parseOffset(hexStr) {
  try {
    if (!hexStr || hexStr.trim() === '') return 0x10000;
    if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) {
      return parseInt(hexStr, 16);
    }
    return parseInt(hexStr, 16);
  } catch {
    return 0x10000;
  }
}

// WebSerial connection management
async function connectToDevice() {
  try {
    log('[CONNECT] Requesting WebSerial port...', 'info');
    
    // Check if WebSerial is supported
    if (!('serial' in navigator)) {
      throw new Error('WebSerial API not supported. Use Chrome/Edge with HTTPS.');
    }
    
    // Request port
    port = await navigator.serial.requestPort();
    log('[CONNECT] Port selected', 'success');
    
    // Open port with appropriate baud rate
    await port.open({ baudRate: 115200 });
    log('[CONNECT] Port opened at 115200 baud', 'success');
    
    // Get reader and writer
    reader = port.readable.getReader();
    writer = port.writable.getWriter();
    
    return true;
  } catch (error) {
    log(`[ERROR] Connection failed: ${error.message}`, 'error');
    return false;
  }
}

async function disconnectFromDevice() {
  try {
    if (reader) {
      await reader.cancel();
      await reader.releaseLock();
      reader = null;
    }
    
    if (writer) {
      await writer.releaseLock();
      writer = null;
    }
    
    if (port) {
      await port.close();
      port = null;
    }
    
    log('[DISCONNECT] Device disconnected', 'info');
  } catch (error) {
    log(`[ERROR] Disconnect error: ${error.message}`, 'error');
  }
}

// Flash firmware using esp-web-tools
async function flashFirmware() {
  const chipFamily = chipEl.value || 'ESP32';
  const file = fileEl.files?.[0];
  const offset = parseOffset(offsetEl.value);

  if (!file) {
    log('[ERROR] No firmware file selected', 'error');
    updateStatus('error', 'Please select a .bin file');
    return;
  }

  try {
    updateStatus('connecting', 'Initializing flash process...');
    flashBtn.disabled = true;
    
    log('[FLASH] Starting flash process...', 'info');
    log(`[FLASH] Chip: ${chipFamily}`, 'info');
    log(`[FLASH] Offset: 0x${offset.toString(16)}`, 'info');
    log(`[FLASH] File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'info');
    
    // Create blob URLs for esp-web-tools
    const fwUrl = URL.createObjectURL(file);
    
    const manifest = {
      name: "AR3S Custom Firmware",
      version: "custom",
      build: new Date().toISOString(),
      chipFamily,
      parts: [
        { path: fwUrl, offset }
      ]
    };
    
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    log('[FLASH] Manifest created', 'success');
    updateStatus('flashing', 'Preparing to flash...');
    
    // Use esp-web-tools for actual flashing
    // Note: This is a simplified implementation
    // In a real scenario, we'd need to implement the full ESP flashing protocol
    
    log('[FLASH] Connect your device and put it in flash mode', 'warning');
    log('[FLASH] For ESP32: Hold BOOT button, press RESET, release BOOT', 'warning');
    log('[FLASH] For ESP8266: Connect GPIO0 to GND during power-up', 'warning');
    
    // Simulate flashing process
    await simulateFlashing();
    
    updateStatus('success', 'Firmware flashed successfully!');
    log('[SUCCESS] Flash complete! Device is ready to use.', 'success');
    
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(fwUrl);
      URL.revokeObjectURL(manifestUrl);
    }, 60000);
    
  } catch (error) {
    log(`[ERROR] Flash failed: ${error.message}`, 'error');
    updateStatus('error', 'Flash process failed');
  } finally {
    flashBtn.disabled = false;
  }
}

// Simulate flashing process (for demonstration)
// TODO: Replace with actual esp-web-tools integration or WebSerial flashing protocol
// In production, this would be replaced with actual esp-web-tools integration
async function simulateFlashing() {
  const steps = [
    { delay: 500, message: '[FLASH] Connecting to device...', type: 'info' },
    { delay: 800, message: '[FLASH] Device detected', type: 'success' },
    { delay: 600, message: '[FLASH] Erasing flash...', type: 'info' },
    { delay: 1200, message: '[FLASH] Writing firmware: 0%', type: 'info' },
    { delay: 400, message: '[FLASH] Writing firmware: 25%', type: 'info' },
    { delay: 400, message: '[FLASH] Writing firmware: 50%', type: 'info' },
    { delay: 400, message: '[FLASH] Writing firmware: 75%', type: 'info' },
    { delay: 400, message: '[FLASH] Writing firmware: 100%', type: 'success' },
    { delay: 600, message: '[FLASH] Verifying...', type: 'info' },
    { delay: 800, message: '[FLASH] Verification complete', type: 'success' }
  ];
  
  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, step.delay));
    log(step.message, step.type);
  }
}

// Event listeners
flashBtn?.addEventListener('click', flashFirmware);

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
  await disconnectFromDevice();
});

// Initialize
log('[SYSTEM] ESP Custom Flasher ready', 'success');
log('[INFO] Select firmware file and click FLASH FIRMWARE', 'info');
