// STK500v1 bootloader protocol implementation for AVR (Uno, Nano, Mark 4)
// Pure JavaScript implementation for WebSerial

import { readWithTimeout, SYNC_TIMEOUT, READ_TIMEOUT, PROGRAM_TIMEOUT } from './serial-utils.js';

// STK500 Protocol Constants
const STK_OK = 0x10;
const STK_INSYNC = 0x14;
const CRC_EOP = 0x20;

const STK_GET_SYNC = 0x30;
const STK_GET_PARAMETER = 0x41;
const STK_SET_DEVICE = 0x42;
const STK_SET_DEVICE_EXT = 0x45;
const STK_ENTER_PROGMODE = 0x50;
const STK_LEAVE_PROGMODE = 0x51;
const STK_LOAD_ADDRESS = 0x55;
const STK_PROG_PAGE = 0x64;
const STK_READ_PAGE = 0x74;
const STK_READ_SIGN = 0x75;

// Parameters
const STK_SW_MAJOR = 0x81;
const STK_SW_MINOR = 0x82;

/**
 * Send command and wait for response
 */
async function sendCommand(writer, reader, command, timeout = READ_TIMEOUT) {
  await writer.write(new Uint8Array(command));
  const response = await readWithTimeout(reader, 2, timeout);
  
  if (response[0] !== STK_INSYNC) {
    throw new Error(`Expected INSYNC, got 0x${response[0].toString(16)}`);
  }
  if (response[1] !== STK_OK) {
    throw new Error(`Expected OK, got 0x${response[1].toString(16)}`);
  }
  
  return response;
}

/**
 * Sync with bootloader (retry logic for auto-reset timing)
 */
async function syncBootloader(writer, reader, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sendCommand(writer, reader, [STK_GET_SYNC, CRC_EOP], SYNC_TIMEOUT);
      return true;
    } catch (err) {
      // Retry with small delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw new Error('Failed to sync with bootloader. Try pressing reset manually.');
}

/**
 * Read chip signature
 */
async function readSignature(writer, reader) {
  await writer.write(new Uint8Array([STK_READ_SIGN, CRC_EOP]));
  const response = await readWithTimeout(reader, 5, READ_TIMEOUT);
  
  if (response[0] !== STK_INSYNC) {
    throw new Error('Signature read failed: INSYNC not received');
  }
  
  return [response[1], response[2], response[3]];
}

/**
 * Set programming address (word address for AVR)
 */
async function setAddress(writer, reader, wordAddress) {
  const low = wordAddress & 0xFF;
  const high = (wordAddress >> 8) & 0xFF;
  await sendCommand(writer, reader, [STK_LOAD_ADDRESS, low, high, CRC_EOP]);
}

/**
 * Program a single page
 */
async function programPage(writer, reader, data, pageSize) {
  const sizeHigh = (pageSize >> 8) & 0xFF;
  const sizeLow = pageSize & 0xFF;
  const command = [STK_PROG_PAGE, sizeHigh, sizeLow, 0x46]; // 0x46 = 'F' for Flash
  command.push(...data);
  command.push(CRC_EOP);
  
  await sendCommand(writer, reader, command, PROGRAM_TIMEOUT); // Longer timeout for programming
}

/**
 * Upload firmware using STK500v1 protocol
 */
export async function uploadSTK500v1(port, binaryData, pageSize, onProgress) {
  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();
  
  try {
    onProgress({ stage: 'sync', message: 'Syncing with bootloader...' });
    await syncBootloader(writer, reader);
    
    onProgress({ stage: 'signature', message: 'Reading chip signature...' });
    const signature = await readSignature(writer, reader);
    onProgress({ 
      stage: 'signature', 
      message: `Chip signature: 0x${signature.map(b => b.toString(16).padStart(2, '0')).join(' ')}`
    });
    
    // Enter programming mode
    onProgress({ stage: 'program', message: 'Entering programming mode...' });
    await sendCommand(writer, reader, [STK_ENTER_PROGMODE, CRC_EOP]);
    
    // Program pages
    const totalPages = Math.ceil(binaryData.length / pageSize);
    let bytesWritten = 0;
    
    for (let page = 0; page < totalPages; page++) {
      const offset = page * pageSize;
      const pageData = new Uint8Array(pageSize);
      pageData.fill(0xFF); // Fill with default flash value
      
      // Copy actual data
      const remaining = Math.min(pageSize, binaryData.length - offset);
      pageData.set(binaryData.subarray(offset, offset + remaining));
      
      // Set address (word address)
      const wordAddress = offset / 2;
      await setAddress(writer, reader, wordAddress);
      
      // Program page
      await programPage(writer, reader, pageData, pageSize);
      
      bytesWritten += remaining;
      const progress = Math.floor((bytesWritten / binaryData.length) * 100);
      onProgress({ 
        stage: 'upload', 
        message: `Uploading... ${bytesWritten}/${binaryData.length} bytes (${progress}%)`,
        bytesWritten,
        totalBytes: binaryData.length,
        progress
      });
    }
    
    // Leave programming mode
    onProgress({ stage: 'done', message: 'Leaving programming mode...' });
    await sendCommand(writer, reader, [STK_LEAVE_PROGMODE, CRC_EOP]);
    
    onProgress({ 
      stage: 'complete', 
      message: `✅ Success! ${binaryData.length} bytes uploaded.`,
      bytesWritten: binaryData.length,
      totalBytes: binaryData.length,
      progress: 100
    });
    
  } finally {
    reader.releaseLock();
    writer.releaseLock();
  }
}
