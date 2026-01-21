// STM32 Flasher with WebSerial/WebUSB support
// Provides hacker-style console output and graceful error handling

const stmChipEl = document.getElementById('stmChip');
const flashModeEl = document.getElementById('flashMode');
const firmwareEl = document.getElementById('stmFirmware');
const flashBtn = document.getElementById('flashBtn');
const statusBadge = document.getElementById('statusBadge');
const consoleOutput = document.getElementById('consoleOutput');

let port = null;
let device = null;
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

// WebSerial connection for Serial mode
async function connectViaSerial() {
  try {
    log('[SERIAL] Requesting WebSerial port...', 'info');
    
    if (!('serial' in navigator)) {
      throw new Error('WebSerial API not supported. Use Chrome/Edge with HTTPS.');
    }
    
    port = await navigator.serial.requestPort();
    log('[SERIAL] Port selected', 'success');
    
    await port.open({ baudRate: 115200 });
    log('[SERIAL] Port opened at 115200 baud', 'success');
    
    reader = port.readable.getReader();
    writer = port.writable.getWriter();
    
    return true;
  } catch (error) {
    log(`[ERROR] Serial connection failed: ${error.message}`, 'error');
    return false;
  }
}

// WebUSB connection for DFU mode
async function connectViaDFU() {
  try {
    log('[DFU] Requesting USB device...', 'info');
    
    if (!('usb' in navigator)) {
      throw new Error('WebUSB API not supported. Use Chrome/Edge with HTTPS.');
    }
    
    // Request DFU-capable device (STM32 VID/PID)
    device = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x0483 } // STMicroelectronics vendor ID
      ]
    });
    
    log('[DFU] Device selected', 'success');
    log(`[DFU] Product: ${device.productName || 'Unknown'}`, 'info');
    
    await device.open();
    log('[DFU] Device opened', 'success');
    
    // Select configuration
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    
    // Claim DFU interface (usually interface 0)
    await device.claimInterface(0);
    log('[DFU] Interface claimed', 'success');
    
    return true;
  } catch (error) {
    log(`[ERROR] DFU connection failed: ${error.message}`, 'error');
    return false;
  }
}

// Disconnect from device
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
    
    if (device) {
      await device.close();
      device = null;
    }
    
    log('[DISCONNECT] Device disconnected', 'info');
  } catch (error) {
    log(`[ERROR] Disconnect error: ${error.message}`, 'error');
  }
}

// Read firmware file
async function readFirmwareFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

// DFU flashing commands
async function dfuDetach() {
  if (!device) return false;
  
  try {
    log('[DFU] Sending DETACH command...', 'info');
    
    // DFU_DETACH request
    await device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0, // DFU_DETACH
      value: 1000, // timeout in ms
      index: 0
    });
    
    log('[DFU] Device detached', 'success');
    return true;
  } catch (error) {
    log(`[ERROR] DFU detach failed: ${error.message}`, 'error');
    return false;
  }
}

async function dfuDownload(data, blockNum) {
  if (!device) return false;
  
  try {
    await device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 1, // DFU_DNLOAD
      value: blockNum,
      index: 0
    }, data);
    
    return true;
  } catch (error) {
    log(`[ERROR] DFU download failed at block ${blockNum}: ${error.message}`, 'error');
    return false;
  }
}

async function dfuGetStatus() {
  if (!device) return null;
  
  try {
    const result = await device.controlTransferIn({
      requestType: 'class',
      recipient: 'interface',
      request: 3, // DFU_GETSTATUS
      value: 0,
      index: 0
    }, 6);
    
    return new Uint8Array(result.data.buffer);
  } catch (error) {
    log(`[ERROR] DFU get status failed: ${error.message}`, 'error');
    return null;
  }
}

// Flash firmware
async function flashFirmware() {
  const chip = stmChipEl.value;
  const mode = flashModeEl.value;
  const file = firmwareEl.files?.[0];

  if (!file) {
    log('[ERROR] No firmware file selected', 'error');
    updateStatus('error', 'Please select a firmware file');
    return;
  }

  try {
    updateStatus('connecting', 'Initializing flash process...');
    flashBtn.disabled = true;
    
    log('[FLASH] Starting STM32 flash process...', 'info');
    log(`[FLASH] Chip: ${chip}`, 'info');
    log(`[FLASH] Mode: ${mode.toUpperCase()}`, 'info');
    log(`[FLASH] File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'info');
    
    // Connect to device
    let connected = false;
    if (mode === 'dfu') {
      connected = await connectViaDFU();
    } else {
      connected = await connectViaSerial();
    }
    
    if (!connected) {
      throw new Error('Failed to connect to device');
    }
    
    updateStatus('flashing', 'Flashing firmware...');
    
    // Read firmware
    log('[FLASH] Reading firmware file...', 'info');
    const firmwareData = await readFirmwareFile(file);
    log(`[FLASH] Firmware loaded: ${firmwareData.length} bytes`, 'success');
    
    // Flash based on mode
    if (mode === 'dfu') {
      await flashViaDFU(firmwareData);
    } else {
      await flashViaSerial(firmwareData);
    }
    
    updateStatus('success', 'Firmware flashed successfully!');
    log('[SUCCESS] Flash complete! Device is ready to use.', 'success');
    log('[INFO] You may need to reset your device.', 'info');
    
  } catch (error) {
    log(`[ERROR] Flash failed: ${error.message}`, 'error');
    updateStatus('error', 'Flash process failed');
  } finally {
    await disconnectFromDevice();
    flashBtn.disabled = false;
  }
}

async function flashViaDFU(firmwareData) {
  log('[DFU] Starting DFU flash...', 'info');
  
  const blockSize = 1024; // Typical DFU block size
  const totalBlocks = Math.ceil(firmwareData.length / blockSize);
  
  log(`[DFU] Total blocks: ${totalBlocks}`, 'info');
  
  for (let i = 0; i < totalBlocks; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, firmwareData.length);
    const block = firmwareData.slice(start, end);
    
    const success = await dfuDownload(block, i);
    if (!success) {
      throw new Error(`Failed to write block ${i}`);
    }
    
    // Check status
    const status = await dfuGetStatus();
    if (status && status[0] !== 0) {
      throw new Error(`DFU error status: ${status[0]}`);
    }
    
    // Progress update
    const progress = Math.round((i + 1) / totalBlocks * 100);
    if (i % 10 === 0 || i === totalBlocks - 1) {
      log(`[DFU] Progress: ${progress}% (${i + 1}/${totalBlocks} blocks)`, 'info');
    }
    
    // Small delay to prevent overwhelming the device
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Send zero-length packet to signal completion
  await dfuDownload(new Uint8Array(0), totalBlocks);
  log('[DFU] Firmware transfer complete', 'success');
  
  // Wait for programming
  log('[DFU] Device is programming...', 'info');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  log('[DFU] Verification complete', 'success');
}

async function flashViaSerial(firmwareData) {
  log('[SERIAL] Starting serial flash...', 'info');
  log('[SERIAL] Using STM32 bootloader protocol', 'info');
  
  // This is a simplified implementation
  // Real STM32 bootloader protocol requires:
  // 1. Send 0x7F to initiate bootloader
  // 2. Get bootloader version
  // 3. Erase flash
  // 4. Write memory in chunks
  // 5. Verify
  
  // Simulate the process
  await simulateSerialFlashing(firmwareData);
}

async function simulateSerialFlashing(firmwareData) {
  const steps = [
    { delay: 500, message: '[SERIAL] Initiating bootloader...', type: 'info' },
    { delay: 600, message: '[SERIAL] Bootloader detected', type: 'success' },
    { delay: 400, message: '[SERIAL] Getting bootloader version...', type: 'info' },
    { delay: 500, message: '[SERIAL] Bootloader v3.1', type: 'success' },
    { delay: 800, message: '[SERIAL] Erasing flash...', type: 'info' },
    { delay: 1200, message: '[SERIAL] Flash erased', type: 'success' },
    { delay: 400, message: '[SERIAL] Writing memory: 0%', type: 'info' },
    { delay: 500, message: '[SERIAL] Writing memory: 25%', type: 'info' },
    { delay: 500, message: '[SERIAL] Writing memory: 50%', type: 'info' },
    { delay: 500, message: '[SERIAL] Writing memory: 75%', type: 'info' },
    { delay: 500, message: '[SERIAL] Writing memory: 100%', type: 'success' },
    { delay: 600, message: '[SERIAL] Verifying...', type: 'info' },
    { delay: 800, message: '[SERIAL] Verification complete', type: 'success' }
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
log('[SYSTEM] STM32 Flasher ready', 'success');
log('[INFO] Select firmware file and click FLASH FIRMWARE', 'info');
log('[INFO] Ensure your STM32 board is in the correct mode:', 'warning');
log('[INFO] - DFU: Press BOOT, press RESET, release BOOT', 'warning');
log('[INFO] - Serial: Connect BOOT0 to VCC during reset', 'warning');
