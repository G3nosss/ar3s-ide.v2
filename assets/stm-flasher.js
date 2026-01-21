// STM32 Flasher - WebUSB DFU Implementation

const protocolEl = document.getElementById('protocol');
const addressEl = document.getElementById('address');
const fileEl = document.getElementById('binfile');
const connectBtn = document.getElementById('connectBtn');
const flashBtn = document.getElementById('flashBtn');
const statusLog = document.getElementById('statusLog');
const systemIndicator = document.getElementById('systemIndicator');

// DFU Constants
const DFU_VERSION = 0x011A;
const USB_CLASS_APP_SPECIFIC = 0xFE;
const USB_SUBCLASS_DFU = 0x01;

// DFU Request Types
const DFU_DETACH = 0x00;
const DFU_DNLOAD = 0x01;
const DFU_UPLOAD = 0x02;
const DFU_GETSTATUS = 0x03;
const DFU_CLRSTATUS = 0x04;
const DFU_GETSTATE = 0x05;
const DFU_ABORT = 0x06;

// DFU States
const DFU_STATE = {
  appIDLE: 0,
  appDETACH: 1,
  dfuIDLE: 2,
  dfuDNLOAD_SYNC: 3,
  dfuDNBUSY: 4,
  dfuDNLOAD_IDLE: 5,
  dfuMANIFEST_SYNC: 6,
  dfuMANIFEST: 7,
  dfuMANIFEST_WAIT_RESET: 8,
  dfuUPLOAD_IDLE: 9,
  dfuERROR: 10
};

// Global state
let device = null;
let firmwareData = null;
let transferSize = 2048; // Default DFU transfer size

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

function parseAddress(hexStr) {
  try {
    const cleanStr = hexStr.trim();
    let value;
    if (cleanStr.startsWith('0x') || cleanStr.startsWith('0X')) {
      value = parseInt(cleanStr, 16);
    } else {
      value = parseInt(cleanStr, 16);
    }
    
    if (isNaN(value)) {
      log(`Invalid address format: ${hexStr}, using default 0x08000000`, 'warning');
      return 0x08000000;
    }
    
    return value;
  } catch (err) {
    log(`Error parsing address: ${err.message}`, 'error');
    return 0x08000000;
  }
}

// Check WebUSB support
function checkWebUSBSupport() {
  if (!('usb' in navigator)) {
    log('WebUSB API not supported in this browser', 'error');
    log('Please use Chrome/Edge 61+ with HTTPS', 'error');
    return false;
  }
  return true;
}

// DFU Helper Functions
async function dfuGetStatus(device) {
  try {
    const result = await device.controlTransferIn({
      requestType: 'class',
      recipient: 'interface',
      request: DFU_GETSTATUS,
      value: 0,
      index: 0
    }, 6);

    if (result.status === 'ok' && result.data) {
      const status = result.data.getUint8(0);
      const pollTimeout = result.data.getUint8(1) | 
                          (result.data.getUint8(2) << 8) | 
                          (result.data.getUint8(3) << 16);
      const state = result.data.getUint8(4);
      const iString = result.data.getUint8(5);
      
      return { status, pollTimeout, state, iString };
    }
  } catch (err) {
    log(`DFU_GETSTATUS error: ${err.message}`, 'error');
    throw err;
  }
}

async function dfuClearStatus(device) {
  try {
    await device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: DFU_CLRSTATUS,
      value: 0,
      index: 0
    });
    log('DFU status cleared', 'info');
  } catch (err) {
    log(`DFU_CLRSTATUS error: ${err.message}`, 'error');
    throw err;
  }
}

async function dfuDownload(device, blockNum, data) {
  try {
    await device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: DFU_DNLOAD,
      value: blockNum,
      index: 0
    }, data);
  } catch (err) {
    log(`DFU_DNLOAD error at block ${blockNum}: ${err.message}`, 'error');
    throw err;
  }
}

async function waitForDfuIdle(device, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await dfuGetStatus(device);
    
    if (status.state === DFU_STATE.dfuIDLE) {
      return true;
    }
    
    if (status.state === DFU_STATE.dfuERROR) {
      await dfuClearStatus(device);
      continue;
    }
    
    await new Promise(resolve => setTimeout(resolve, status.pollTimeout || 100));
  }
  
  throw new Error('Timeout waiting for DFU_IDLE state');
}

// Connect to STM32 device
async function connectDevice() {
  clearLog();
  log('=== INITIATING DEVICE CONNECTION ===', 'info');
  
  const protocol = protocolEl.value;
  
  if (protocol === 'webusb') {
    if (!checkWebUSBSupport()) {
      return;
    }
    
    try {
      log('Requesting USB device access...', 'info');
      
      // Request STM32 DFU device
      // Vendor ID 0x0483 is STMicroelectronics (covers most STM32 devices in DFU mode)
      device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x0483 } // STMicroelectronics STM32 devices
        ]
      });
      
      log(`Device selected: ${device.productName || 'Unknown'}`, 'success');
      log(`Manufacturer: ${device.manufacturerName || 'Unknown'}`, 'info');
      log(`Serial: ${device.serialNumber || 'N/A'}`, 'info');
      
      log('Opening device...', 'info');
      await device.open();
      log('Device opened successfully', 'success');
      
      // Select configuration
      if (device.configuration === null) {
        log('Selecting configuration 1...', 'info');
        await device.selectConfiguration(1);
      }
      
      // Claim DFU interface (usually interface 0)
      log('Claiming DFU interface...', 'info');
      await device.claimInterface(0);
      log('DFU interface claimed', 'success');
      
      // Get DFU status
      log('Checking DFU status...', 'info');
      const status = await dfuGetStatus(device);
      log(`DFU State: ${status.state}`, 'info');
      
      if (status.state === DFU_STATE.dfuERROR) {
        log('Device in error state, clearing...', 'warning');
        await dfuClearStatus(device);
        await waitForDfuIdle(device);
      }
      
      log('=== CONNECTION ESTABLISHED ===', 'success');
      flashBtn.disabled = false;
      connectBtn.textContent = '🔌 Connected';
      connectBtn.style.opacity = '0.7';
      
    } catch (err) {
      log(`Connection failed: ${err.message}`, 'error');
      if (err.name === 'NotFoundError') {
        log('No device selected or device not found', 'error');
      }
      device = null;
      flashBtn.disabled = true;
    }
  } else {
    log('WebSerial protocol is not supported for STM32 DFU', 'warning');
    log('STM32 DFU requires WebUSB. Please use WebUSB (DFU) protocol', 'info');
  }
}

// Flash firmware
async function flashFirmware() {
  if (!device) {
    log('No device connected', 'error');
    return;
  }
  
  if (!firmwareData) {
    log('No firmware file loaded', 'error');
    return;
  }
  
  clearLog();
  log('=== INITIATING FIRMWARE FLASH ===', 'info');
  
  const address = parseAddress(addressEl.value);
  log(`Target address: 0x${address.toString(16).toUpperCase()}`, 'info');
  log(`Firmware size: ${firmwareData.byteLength} bytes`, 'info');
  
  try {
    // Ensure device is in DFU_IDLE state
    log('Preparing device for download...', 'info');
    await waitForDfuIdle(device);
    
    // Calculate number of blocks
    const numBlocks = Math.ceil(firmwareData.byteLength / transferSize);
    log(`Total blocks to transfer: ${numBlocks}`, 'info');
    
    // Download firmware in blocks
    for (let blockNum = 0; blockNum < numBlocks; blockNum++) {
      const offset = blockNum * transferSize;
      const end = Math.min(offset + transferSize, firmwareData.byteLength);
      const chunk = firmwareData.slice(offset, end);
      
      log(`Flashing block ${blockNum + 1}/${numBlocks} (${chunk.byteLength} bytes)...`, 'info');
      
      await dfuDownload(device, blockNum, chunk);
      
      // Wait for download to complete
      let status = await dfuGetStatus(device);
      while (status.state === DFU_STATE.dfuDNBUSY) {
        await new Promise(resolve => setTimeout(resolve, status.pollTimeout || 10));
        status = await dfuGetStatus(device);
      }
      
      if (status.state === DFU_STATE.dfuERROR) {
        throw new Error(`DFU error at block ${blockNum}`);
      }
      
      // Progress indicator
      const progress = ((blockNum + 1) / numBlocks * 100).toFixed(1);
      if ((blockNum + 1) % 10 === 0 || blockNum === numBlocks - 1) {
        log(`Progress: ${progress}%`, 'success');
      }
    }
    
    // Send zero-length download to signal end
    log('Finalizing download...', 'info');
    await dfuDownload(device, 0, new Uint8Array(0));
    
    // Wait for manifest
    log('Waiting for device manifest...', 'info');
    let status = await dfuGetStatus(device);
    while (status.state === DFU_STATE.dfuMANIFEST_SYNC || 
           status.state === DFU_STATE.dfuMANIFEST ||
           status.state === DFU_STATE.dfuDNBUSY) {
      await new Promise(resolve => setTimeout(resolve, status.pollTimeout || 100));
      try {
        status = await dfuGetStatus(device);
      } catch {
        // Device may have reset
        break;
      }
    }
    
    log('=== FLASH COMPLETE ===', 'success');
    log('Device may reset automatically', 'info');
    log('If not, manually reset with BOOT0=0', 'info');
    
  } catch (err) {
    log(`Flash failed: ${err.message}`, 'error');
    log(`Stack: ${err.stack}`, 'error');
  }
}

// Event listeners
connectBtn?.addEventListener('click', connectDevice);

flashBtn?.addEventListener('click', flashFirmware);

fileEl?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) {
    firmwareData = null;
    return;
  }
  
  log(`Loading firmware: ${file.name}`, 'info');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    firmwareData = new Uint8Array(arrayBuffer);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    log(`Firmware loaded: ${file.name} (${sizeMB} MB)`, 'success');
  } catch (err) {
    log(`Failed to load firmware: ${err.message}`, 'error');
    firmwareData = null;
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  log('STM Flasher initialized', 'success');
  log('System ready for firmware upload', 'info');
  
  if (checkWebUSBSupport()) {
    log('WebUSB API available', 'success');
  }
});
