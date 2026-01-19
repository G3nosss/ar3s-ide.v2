// Main upload orchestrator for Arduino WebSerial upload
// Coordinates build, serial port selection, and upload protocols

import { getBoardById } from './boards.js';
import { parseIntelHex } from './intelhex.js';
import { uploadSTK500v1 } from './stk500v1.js';
import { uploadSTK500v2 } from './stk500v2.js';
import { saveUpload, getSketchNameFromCode, renderHistory } from './upload-history.js';

let currentPort = null;

/**
 * Check WebSerial browser support
 */
function checkWebSerialSupport() {
  if (!('serial' in navigator)) {
    return {
      supported: false,
      message: '⚠️ Upload to Arduino requires Chrome or Edge on desktop. WebSerial is not supported in this browser.'
    };
  }
  return { supported: true };
}

/**
 * Auto-reset Arduino via DTR toggle
 */
async function autoResetArduino(port) {
  try {
    await port.setSignals({ dataTerminalReady: false });
    await new Promise(resolve => setTimeout(resolve, 100));
    await port.setSignals({ dataTerminalReady: true });
    await new Promise(resolve => setTimeout(resolve, 250)); // Wait for bootloader
  } catch (err) {
    console.warn('Auto-reset failed:', err);
    // Not fatal - some boards don't support DTR
  }
}

/**
 * Build hex file from code
 */
async function buildHex(code, fqbn, logEl) {
  logEl.textContent = 'Compiling sketch...';
  
  const res = await fetch('/api/build/avr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, fqbn })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Build request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  
  if (data.log) {
    logEl.textContent = data.log;
  }
  
  if (!data.artifactUrl) {
    throw new Error('Build failed: no artifact URL returned');
  }

  return data.artifactUrl;
}

/**
 * Fetch hex file
 */
async function fetchHexFile(artifactUrl, logEl) {
  logEl.textContent += '\n\nFetching .hex file...';
  
  const res = await fetch(artifactUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch hex file: ${res.status}`);
  }
  
  return await res.text();
}

/**
 * Request and open serial port
 */
async function openSerialPort(baudRate, logEl) {
  logEl.textContent += '\n\nOpening serial port...';
  
  // Try to reuse existing port if it's open, otherwise request new one
  if (currentPort) {
    try {
      // Check if port is still valid by checking readable/writable streams
      if (currentPort.readable && currentPort.writable) {
        // Port is already open, close it first to reset state
        await currentPort.close();
      }
    } catch (err) {
      // Port may already be closed, continue
    }
    currentPort = null;
  }
  
  // Request new port (shows browser permission dialog)
  currentPort = await navigator.serial.requestPort();
  
  // Open with board's baud rate
  await currentPort.open({ baudRate });
  
  return currentPort;
}

/**
 * Main upload function
 */
export async function buildAndUpload(getEditorValueFn, boardId, logEl, historyEl) {
  const support = checkWebSerialSupport();
  if (!support.supported) {
    logEl.textContent = support.message;
    return;
  }
  
  let uploadSuccess = false;
  let bytesUploaded = 0;
  const code = getEditorValueFn();
  const sketchName = getSketchNameFromCode(code);
  
  try {
    // Get board configuration
    const board = getBoardById(boardId);
    if (!board) {
      throw new Error(`Board not found: ${boardId}`);
    }
    
    logEl.textContent = `Selected board: ${board.name}\n`;
    if (board.note) {
      logEl.textContent += `Note: ${board.note}\n\n`;
    }
    
    // Step 1: Build hex file
    const artifactUrl = await buildHex(code, board.fqbn, logEl);
    
    // Step 2: Fetch hex file
    const hexContent = await fetchHexFile(artifactUrl, logEl);
    
    // Step 3: Parse hex to binary
    logEl.textContent += '\n\nParsing Intel HEX format...';
    const { data: binaryData } = parseIntelHex(hexContent);
    logEl.textContent += `\nBinary size: ${binaryData.length} bytes`;
    
    // Step 4: Open serial port
    const port = await openSerialPort(board.bootloader.baudRate, logEl);
    
    // Step 5: Auto-reset Arduino
    logEl.textContent += '\n\nResetting Arduino...';
    await autoResetArduino(port);
    
    // Step 6: Upload via appropriate protocol
    logEl.textContent += '\n\n';
    
    // Store the current log length to only update the last line during progress
    let lastLogLength = logEl.textContent.length;
    
    const onProgress = (status) => {
      // Replace only the last progress line for better performance
      logEl.textContent = logEl.textContent.substring(0, lastLogLength) + status.message;
      lastLogLength = logEl.textContent.length;
      logEl.scrollTop = logEl.scrollHeight;
      
      if (status.bytesWritten) {
        bytesUploaded = status.bytesWritten;
      }
      
      // On stage change, add newline for next update
      if (status.stage === 'complete' || status.stage === 'done') {
        logEl.textContent += '\n';
        lastLogLength = logEl.textContent.length;
      }
    };
    
    if (board.bootloader.protocol === 'stk500v1') {
      await uploadSTK500v1(port, binaryData, board.bootloader.pageSize, onProgress);
    } else if (board.bootloader.protocol === 'stk500v2') {
      await uploadSTK500v2(port, binaryData, board.bootloader.pageSize, onProgress);
    } else {
      throw new Error(`Unsupported protocol: ${board.bootloader.protocol}`);
    }
    
    uploadSuccess = true;
    
    // Close port
    await port.close();
    currentPort = null;
    
  } catch (err) {
    logEl.textContent += `\n\n❌ Error: ${err.message}`;
    
    // Provide helpful error messages
    if (err.message.includes('timeout') || err.message.includes('sync')) {
      logEl.textContent += '\n\n💡 Tip: Try pressing the RESET button on your Arduino when you see "Syncing with bootloader..."';
    } else if (err.message.includes('port')) {
      logEl.textContent += '\n\n💡 Tip: Make sure your Arduino is connected and not in use by another application.';
    }
    
    // Try to close port on error
    if (currentPort) {
      try {
        await currentPort.close();
      } catch (closeErr) {
        console.error('Failed to close port:', closeErr);
      }
      currentPort = null;
    }
  } finally {
    // Save to history
    const board = getBoardById(boardId);
    if (board) {
      saveUpload({
        timestamp: Date.now(),
        board: board.name,
        sketchName,
        bytes: bytesUploaded || 0,
        success: uploadSuccess
      });
      
      // Update history display
      if (historyEl) {
        renderHistory(historyEl);
      }
    }
  }
}

/**
 * Initialize upload button and history
 */
export function initializeUpload(getEditorValueFn) {
  const uploadBtn = document.getElementById('uploadArduinoBtn');
  const boardSelect = document.getElementById('boardSelect');
  const logEl = document.getElementById('buildLog');
  const historyEl = document.getElementById('uploadHistory');
  
  if (!uploadBtn || !boardSelect || !logEl) {
    console.error('Upload: Required elements not found');
    return;
  }
  
  // Check browser support
  const support = checkWebSerialSupport();
  if (!support.supported) {
    uploadBtn.disabled = true;
    uploadBtn.title = 'WebSerial not supported in this browser';
  }
  
  // Initialize history display
  if (historyEl) {
    historyEl.dataset.expanded = 'false';
    renderHistory(historyEl);
  }
  
  // Upload button click handler
  uploadBtn.addEventListener('click', async () => {
    const boardId = boardSelect.value;
    if (!boardId) {
      logEl.textContent = 'Please select a board first.';
      return;
    }
    
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    
    try {
      await buildAndUpload(getEditorValueFn, boardId, logEl, historyEl);
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload to Arduino';
    }
  });
}
