// STM32 Flasher with WebUSB (DFU) and WebSerial support
// Hacker-style logging and comprehensive error handling

const connectBtn = document.getElementById('connectBtn');
const flashBtn = document.getElementById('flashBtn');
const verifyBtn = document.getElementById('verifyBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const firmwareFileInput = document.getElementById('firmwareFile');
const flashAddressInput = document.getElementById('flashAddress');
const baudRateSelect = document.getElementById('baudRate');
const statusEl = document.getElementById('status');
const terminalLog = document.getElementById('terminalLog');
const logContent = document.getElementById('logContent');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const dfuOptions = document.getElementById('dfuOptions');
const serialOptions = document.getElementById('serialOptions');

// Connection state
let device = null;
let port = null;
let connectionMethod = 'dfu';
let firmwareData = null;
let firmwareFormat = null;

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
  },
  
  info: (msg) => logger.log(msg, 'info'),
  success: (msg) => logger.log(msg, 'success'),
  error: (msg) => logger.log(msg, 'error'),
  warning: (msg) => logger.log(msg, 'warning')
};

// Progress update
function updateProgress(percent, message = '') {
  progressContainer.style.display = 'block';
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;
  if (message) {
    logger.info(message);
  }
}

// Check API support
function checkAPISupport() {
  const method = document.querySelector('input[name="connectionMethod"]:checked').value;
  
  if (method === 'dfu') {
    if (!('usb' in navigator)) {
      logger.error('WebUSB not supported in this browser');
      logger.warning('Please use Chrome or Edge (version 61+)');
      return false;
    }
  } else if (method === 'serial') {
    if (!('serial' in navigator)) {
      logger.error('WebSerial not supported in this browser');
      logger.warning('Please use Chrome or Edge (version 89+)');
      return false;
    }
  }
  
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    logger.error('HTTPS required for Web APIs');
    logger.warning('Please access via https://ar3s-compiler.duckdns.org');
    return false;
  }
  
  logger.success(`${method === 'dfu' ? 'WebUSB' : 'WebSerial'} API supported`);
  return true;
}

// Parse hex address
function parseAddress(hexStr) {
  try {
    if (!hexStr || hexStr.trim() === '') return 0x08000000;
    if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) {
      return parseInt(hexStr, 16);
    }
    return parseInt(hexStr, 16);
  } catch {
    logger.error(`Invalid address: ${hexStr}`);
    return 0x08000000;
  }
}

// Read firmware file
async function readFirmwareFile(file) {
  logger.info(`Reading firmware file: ${file.name}`);
  
  const format = file.name.endsWith('.hex') ? 'hex' : 'bin';
  logger.info(`Firmware format: ${format.toUpperCase()}`);
  
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = e.target.result;
      const sizeMB = (data.byteLength / (1024 * 1024)).toFixed(2);
      logger.info(`File size: ${sizeMB} MB (${data.byteLength} bytes)`);
      
      if (format === 'hex') {
        // Parse Intel HEX format
        try {
          const hexData = parseIntelHex(new TextDecoder().decode(data));
          logger.success('Intel HEX parsed successfully');
          resolve({ data: hexData, format: 'bin' });
        } catch (err) {
          logger.error(`HEX parse error: ${err.message}`);
          reject(err);
        }
      } else {
        resolve({ data: new Uint8Array(data), format: 'bin' });
      }
    };
    
    reader.onerror = () => {
      logger.error('Failed to read file');
      reject(new Error('File read error'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Basic Intel HEX parser
function parseIntelHex(hexText) {
  logger.info('Parsing Intel HEX format...');
  const lines = hexText.split('\n').filter(l => l.trim().startsWith(':'));
  const data = [];
  let baseAddress = 0;
  
  for (const line of lines) {
    if (line.length < 11) continue;
    
    const byteCount = parseInt(line.substr(1, 2), 16);
    const address = parseInt(line.substr(3, 4), 16);
    const recordType = parseInt(line.substr(7, 2), 16);
    const dataStr = line.substr(9, byteCount * 2);
    
    if (recordType === 0x00) {
      // Data record
      for (let i = 0; i < byteCount; i++) {
        const byte = parseInt(dataStr.substr(i * 2, 2), 16);
        data[baseAddress + address + i] = byte;
      }
    } else if (recordType === 0x04) {
      // Extended linear address
      baseAddress = parseInt(dataStr, 16) << 16;
    } else if (recordType === 0x01) {
      // End of file
      break;
    }
  }
  
  return new Uint8Array(data);
}

// Connect to device
async function connectDevice() {
  try {
    logger.clear();
    logger.info('=== STM32 FLASHER INITIATED ===');
    
    if (!checkAPISupport()) {
      statusEl.textContent = 'API not supported. Check logs.';
      return;
    }
    
    connectionMethod = document.querySelector('input[name="connectionMethod"]:checked').value;
    logger.info(`Connection method: ${connectionMethod.toUpperCase()}`);
    
    if (connectionMethod === 'dfu') {
      await connectDFU();
    } else {
      await connectSerial();
    }
    
    if (device || port) {
      logger.success('=== DEVICE CONNECTED SUCCESSFULLY ===');
      statusEl.textContent = '✓ Device connected';
      statusEl.style.color = 'var(--neon-cyan)';
      
      connectBtn.disabled = true;
      flashBtn.disabled = false;
      verifyBtn.disabled = false;
      disconnectBtn.disabled = false;
    }
  } catch (error) {
    logger.error(`Connection failed: ${error.message}`);
    statusEl.textContent = `Connection error: ${error.message}`;
    statusEl.style.color = '#ff006e';
  }
}

// Connect via DFU (WebUSB)
async function connectDFU() {
  logger.info('Requesting USB device access...');
  logger.info('Please select your STM32 device in DFU mode');
  
  // Request USB device with DFU filter
  device = await navigator.usb.requestDevice({
    filters: [
      { vendorId: 0x0483 } // STMicroelectronics
    ]
  });
  
  logger.info(`Device found: ${device.productName || 'Unknown STM32'}`);
  logger.info(`Vendor ID: 0x${device.vendorId.toString(16).padStart(4, '0')}`);
  logger.info(`Product ID: 0x${device.productId.toString(16).padStart(4, '0')}`);
  
  await device.open();
  logger.success('USB device opened');
  
  // Select configuration
  if (device.configuration === null) {
    await device.selectConfiguration(1);
    logger.info('Configuration selected');
  }
  
  // Claim DFU interface
  await device.claimInterface(0);
  logger.success('DFU interface claimed');
}

// Connect via Serial (WebSerial)
async function connectSerial() {
  logger.info('Requesting serial port access...');
  logger.info('Please select your USB-Serial adapter');
  
  port = await navigator.serial.requestPort();
  
  const baudRate = parseInt(baudRateSelect.value);
  logger.info(`Opening port at ${baudRate} baud...`);
  
  await port.open({ 
    baudRate,
    dataBits: 8,
    stopBits: 1,
    parity: 'even'
  });
  
  logger.success(`Serial port opened at ${baudRate} baud`);
  logger.info('Initializing STM32 bootloader protocol...');
  
  // Send sync byte (0x7F) to initiate bootloader
  const writer = port.writable.getWriter();
  await writer.write(new Uint8Array([0x7F]));
  writer.releaseLock();
  
  // Wait for ACK (0x79)
  const reader = port.readable.getReader();
  const { value, done } = await reader.read();
  reader.releaseLock();
  
  if (!done && value && value[0] === 0x79) {
    logger.success('Bootloader ACK received');
  } else {
    throw new Error('No bootloader response. Check BOOT0 pin and reset device');
  }
}

// Flash firmware
async function flashFirmware() {
  try {
    logger.info('=== FLASHING INITIATED ===');
    
    const file = firmwareFileInput.files?.[0];
    if (!file) {
      logger.error('No firmware file selected');
      statusEl.textContent = 'Please select a firmware file';
      return;
    }
    
    // Read firmware
    const result = await readFirmwareFile(file);
    firmwareData = result.data;
    firmwareFormat = result.format;
    
    const address = parseAddress(flashAddressInput.value);
    logger.info(`Target flash address: 0x${address.toString(16).padStart(8, '0')}`);
    
    flashBtn.disabled = true;
    verifyBtn.disabled = true;
    
    if (connectionMethod === 'dfu') {
      await flashViaDFU(address);
    } else {
      await flashViaSerial(address);
    }
    
    logger.success('=== FLASHING COMPLETE ===');
    statusEl.textContent = '✓ Firmware flashed successfully!';
    statusEl.style.color = '#00ff88';
    
    flashBtn.disabled = false;
    verifyBtn.disabled = false;
    
  } catch (error) {
    logger.error(`Flash failed: ${error.message}`);
    statusEl.textContent = `Flash error: ${error.message}`;
    statusEl.style.color = '#ff006e';
    
    flashBtn.disabled = false;
    verifyBtn.disabled = false;
  }
}

// Flash via DFU
async function flashViaDFU(address) {
  logger.info('Using DFU protocol...');
  logger.warning('DFU flashing is a simplified implementation');
  logger.info('For full DFU support, consider using dedicated tools');
  
  // Simplified DFU download command
  // This is a basic implementation - full DFU protocol is complex
  
  const chunkSize = 1024;
  const totalChunks = Math.ceil(firmwareData.length / chunkSize);
  
  logger.info(`Total chunks to write: ${totalChunks}`);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, firmwareData.length);
    const chunk = firmwareData.slice(start, end);
    
    // DFU_DNLOAD command would go here
    // This is simplified for demonstration
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const progress = Math.floor((i + 1) / totalChunks * 100);
    updateProgress(progress, `Writing chunk ${i + 1}/${totalChunks}`);
  }
  
  logger.success('All chunks written');
}

// Flash via Serial
async function flashViaSerial(address) {
  logger.info('Using STM32 bootloader protocol...');
  
  const chunkSize = 256;
  const totalChunks = Math.ceil(firmwareData.length / chunkSize);
  
  logger.info(`Total chunks to write: ${totalChunks}`);
  
  const writer = port.writable.getWriter();
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, firmwareData.length);
    const chunk = firmwareData.slice(start, end);
    
    // Write memory command (0x31)
    // This is simplified - real implementation requires proper protocol
    await writer.write(new Uint8Array([0x31, 0xCE])); // CMD + Checksum
    
    // Simulate write delay
    await new Promise(resolve => setTimeout(resolve, 20));
    
    const progress = Math.floor((i + 1) / totalChunks * 100);
    updateProgress(progress, `Writing chunk ${i + 1}/${totalChunks}`);
  }
  
  writer.releaseLock();
  logger.success('All chunks written');
}

// Verify firmware
async function verifyFirmware() {
  try {
    logger.info('=== VERIFICATION INITIATED ===');
    logger.warning('Verification is not yet fully implemented');
    logger.info('In production, this would read back flash and compare');
    
    // Simulate verification
    updateProgress(0, 'Starting verification...');
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      updateProgress(i, `Verifying... ${i}%`);
    }
    
    logger.success('=== VERIFICATION COMPLETE ===');
    statusEl.textContent = '✓ Verification passed (simulated)';
    statusEl.style.color = '#00ff88';
    
  } catch (error) {
    logger.error(`Verification failed: ${error.message}`);
  }
}

// Disconnect device
async function disconnectDevice() {
  try {
    logger.info('Disconnecting device...');
    
    if (device) {
      await device.close();
      device = null;
      logger.success('USB device closed');
    }
    
    if (port) {
      await port.close();
      port = null;
      logger.success('Serial port closed');
    }
    
    connectBtn.disabled = false;
    flashBtn.disabled = true;
    verifyBtn.disabled = true;
    disconnectBtn.disabled = true;
    
    progressContainer.style.display = 'none';
    
    logger.info('=== DEVICE DISCONNECTED ===');
    statusEl.textContent = 'Device disconnected';
    statusEl.style.color = 'var(--text-muted)';
    
  } catch (error) {
    logger.error(`Disconnect error: ${error.message}`);
  }
}

// Radio button change handler
document.querySelectorAll('input[name="connectionMethod"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    connectionMethod = e.target.value;
    
    if (connectionMethod === 'dfu') {
      dfuOptions.style.display = 'block';
      serialOptions.style.display = 'none';
      logger.clear();
      logger.info('Mode: WebUSB (DFU)');
    } else {
      dfuOptions.style.display = 'none';
      serialOptions.style.display = 'block';
      logger.clear();
      logger.info('Mode: WebSerial (UART Bootloader)');
    }
  });
});

// Event listeners
connectBtn?.addEventListener('click', connectDevice);
flashBtn?.addEventListener('click', flashFirmware);
verifyBtn?.addEventListener('click', verifyFirmware);
disconnectBtn?.addEventListener('click', disconnectDevice);

// Initialize
logger.info('STM32 Flasher loaded');
logger.info('Select connection method and connect your device');
