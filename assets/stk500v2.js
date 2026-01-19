// STK500v2 bootloader protocol implementation for AVR (Mega 2560)
// Pure JavaScript implementation for WebSerial

import { readWithTimeout, RESPONSE_TIMEOUT, PROGRAM_TIMEOUT } from './serial-utils.js';

// STK500v2 Protocol Constants
const MESSAGE_START = 0x1B;
const TOKEN = 0x0E;

// Commands
const CMD_SIGN_ON = 0x01;
const CMD_SET_PARAMETER = 0x02;
const CMD_GET_PARAMETER = 0x03;
const CMD_LOAD_ADDRESS = 0x06;
const CMD_ENTER_PROGMODE_ISP = 0x10;
const CMD_LEAVE_PROGMODE_ISP = 0x11;
const CMD_CHIP_ERASE_ISP = 0x12;
const CMD_PROGRAM_FLASH_ISP = 0x13;
const CMD_READ_FLASH_ISP = 0x14;
const CMD_READ_SIGNATURE_ISP = 0x1B;

// Status codes
const STATUS_CMD_OK = 0x00;

/**
 * Calculate checksum for STK500v2 message
 */
function calculateChecksum(data) {
  let checksum = 0;
  for (const byte of data) {
    checksum ^= byte;
  }
  return checksum;
}

/**
 * Create STK500v2 message
 */
function createMessage(sequenceNumber, command, data = []) {
  const messageBody = [sequenceNumber, command, ...data];
  const messageSize = messageBody.length;
  const sizeHigh = (messageSize >> 8) & 0xFF;
  const sizeLow = messageSize & 0xFF;
  
  const checksumData = [MESSAGE_START, sequenceNumber, sizeHigh, sizeLow, TOKEN, ...messageBody];
  const checksum = calculateChecksum(checksumData.slice(1));
  
  return new Uint8Array([MESSAGE_START, sequenceNumber, sizeHigh, sizeLow, TOKEN, ...messageBody, checksum]);
}

/**
 * Read STK500v2 response
 */
async function readResponse(reader, timeout = RESPONSE_TIMEOUT) {
  // Read header: START + SEQ + SIZE_H + SIZE_L + TOKEN
  const header = await readWithTimeout(reader, 5, timeout);
  
  if (header[0] !== MESSAGE_START) {
    throw new Error(`Expected MESSAGE_START, got 0x${header[0].toString(16)}`);
  }
  
  const sequenceNumber = header[1];
  const messageSize = (header[2] << 8) | header[3];
  const token = header[4];
  
  if (token !== TOKEN) {
    throw new Error(`Expected TOKEN, got 0x${token.toString(16)}`);
  }
  
  // Read body (already includes sequence and command) + checksum
  const remaining = messageSize + 1; // +1 for checksum
  const body = await readWithTimeout(reader, remaining, timeout);
  
  return {
    sequenceNumber,
    command: body[1],
    status: body[2],
    data: body.slice(2, -1),
    checksum: body[body.length - 1]
  };
}

/**
 * Send command and get response
 */
async function sendCommand(writer, reader, sequenceNumber, command, data = [], timeout = RESPONSE_TIMEOUT) {
  const message = createMessage(sequenceNumber, command, data);
  await writer.write(message);
  
  const response = await readResponse(reader, timeout);
  
  if (response.status !== STATUS_CMD_OK) {
    throw new Error(`Command 0x${command.toString(16)} failed with status 0x${response.status.toString(16)}`);
  }
  
  return response;
}

/**
 * Sign on to bootloader
 */
async function signOn(writer, reader, sequenceNumber) {
  const response = await sendCommand(writer, reader, sequenceNumber, CMD_SIGN_ON, []);
  // Response contains signature string like "AVRISP_2"
  return response;
}

/**
 * Read chip signature
 */
async function readSignature(writer, reader, sequenceNumber) {
  // CMD_READ_SIGNATURE_ISP parameters for ATmega2560
  const data = [
    0x00, // poll index (don't care)
    0x30, 0x00, 0x00, 0x00, // read signature byte 0
    0x30, 0x00, 0x01, 0x00, // read signature byte 1
    0x30, 0x00, 0x02, 0x00  // read signature byte 2
  ];
  
  const response = await sendCommand(writer, reader, sequenceNumber, CMD_READ_SIGNATURE_ISP, data);
  
  return [response.data[2], response.data[3], response.data[4]];
}

/**
 * Enter programming mode
 */
async function enterProgramMode(writer, reader, sequenceNumber) {
  // Standard ISP parameters
  const data = [
    0x01, // timeout
    0x01, // stabDelay
    0x01, // cmdexeDelay
    0x01, // synchLoops
    0x00, // byteDelay
    0x53, // pollValue
    0x03, // pollIndex
    0xAC, 0x53, 0x00, 0x00 // SPI command
  ];
  
  await sendCommand(writer, reader, sequenceNumber, CMD_ENTER_PROGMODE_ISP, data);
}

/**
 * Leave programming mode
 */
async function leaveProgramMode(writer, reader, sequenceNumber) {
  const data = [0x01, 0x01]; // preDelay, postDelay
  await sendCommand(writer, reader, sequenceNumber, CMD_LEAVE_PROGMODE_ISP, data);
}

/**
 * Load address (byte address for STK500v2)
 */
async function loadAddress(writer, reader, sequenceNumber, address) {
  const addr = [
    (address >> 24) & 0xFF,
    (address >> 16) & 0xFF,
    (address >> 8) & 0xFF,
    address & 0xFF
  ];
  
  await sendCommand(writer, reader, sequenceNumber, CMD_LOAD_ADDRESS, addr);
}

/**
 * Program flash page
 */
async function programFlash(writer, reader, sequenceNumber, data, pageSize) {
  const sizeHigh = (pageSize >> 8) & 0xFF;
  const sizeLow = pageSize & 0xFF;
  
  const params = [
    sizeHigh, sizeLow, // bytes to write
    0xC1, // mode: write page, erase first
    0x0A, // delay
    0x40, // cmd1
    0x4C, // cmd2
    0x20, // cmd3
    0x00, // poll1
    0x00, // poll2
    ...data
  ];
  
  await sendCommand(writer, reader, sequenceNumber, CMD_PROGRAM_FLASH_ISP, params, PROGRAM_TIMEOUT);
}

/**
 * Upload firmware using STK500v2 protocol
 */
export async function uploadSTK500v2(port, binaryData, pageSize, onProgress) {
  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();
  
  let sequenceNumber = 1;
  
  try {
    onProgress({ stage: 'sync', message: 'Signing on to bootloader...' });
    await signOn(writer, reader, sequenceNumber++);
    
    onProgress({ stage: 'signature', message: 'Reading chip signature...' });
    const signature = await readSignature(writer, reader, sequenceNumber++);
    onProgress({ 
      stage: 'signature', 
      message: `Chip signature: 0x${signature.map(b => b.toString(16).padStart(2, '0')).join(' ')}`
    });
    
    onProgress({ stage: 'program', message: 'Entering programming mode...' });
    await enterProgramMode(writer, reader, sequenceNumber++);
    
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
      
      // Load address (byte address for STK500v2, not word address)
      await loadAddress(writer, reader, sequenceNumber++, offset);
      
      // Program page
      await programFlash(writer, reader, sequenceNumber++, pageData, pageSize);
      
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
    
    onProgress({ stage: 'done', message: 'Leaving programming mode...' });
    await leaveProgramMode(writer, reader, sequenceNumber++);
    
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
