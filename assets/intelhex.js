// Intel HEX format parser
// Converts ASCII .hex files to binary data suitable for AVR programming

/**
 * Parse Intel HEX format string into binary data
 * @param {string} hexString - The .hex file contents
 * @returns {Object} { data: Uint8Array, startAddress: number, endAddress: number }
 */
export function parseIntelHex(hexString) {
  const lines = hexString.split('\n').map(line => line.trim()).filter(line => line.startsWith(':'));
  
  let minAddress = Infinity;
  let maxAddress = 0;
  const dataMap = new Map(); // address -> byte
  let extendedLinearAddress = 0;

  for (const line of lines) {
    if (line.length < 11) continue; // Minimum valid record length
    
    // Parse record
    const byteCount = parseInt(line.substring(1, 3), 16);
    const address = parseInt(line.substring(3, 7), 16);
    const recordType = parseInt(line.substring(7, 9), 16);
    const data = line.substring(9, 9 + byteCount * 2);
    
    // Checksum verification
    const checksumProvided = parseInt(line.substring(9 + byteCount * 2, 11 + byteCount * 2), 16);
    
    // Calculate expected checksum
    let checksumCalculated = byteCount + (address >> 8) + (address & 0xFF) + recordType;
    for (let i = 0; i < byteCount; i++) {
      checksumCalculated += parseInt(data.substring(i * 2, i * 2 + 2), 16);
    }
    checksumCalculated = ((~checksumCalculated) + 1) & 0xFF;
    
    if (checksumCalculated !== checksumProvided) {
      throw new Error(`Checksum mismatch at line: ${line}. Expected 0x${checksumCalculated.toString(16)}, got 0x${checksumProvided.toString(16)}`);
    }
    
    switch (recordType) {
      case 0x00: // Data record
        {
          const fullAddress = extendedLinearAddress + address;
          for (let i = 0; i < byteCount; i++) {
            const byte = parseInt(data.substring(i * 2, i * 2 + 2), 16);
            const addr = fullAddress + i;
            dataMap.set(addr, byte);
            minAddress = Math.min(minAddress, addr);
            maxAddress = Math.max(maxAddress, addr);
          }
        }
        break;
        
      case 0x01: // End of file
        // Done parsing
        break;
        
      case 0x04: // Extended linear address (upper 16 bits of address)
        {
          const upperAddress = parseInt(data, 16);
          extendedLinearAddress = upperAddress << 16;
        }
        break;
        
      case 0x02: // Extended segment address (legacy, rarely used)
        {
          const segmentAddress = parseInt(data, 16);
          extendedLinearAddress = segmentAddress << 4;
        }
        break;
        
      default:
        // Ignore unknown record types
        break;
    }
  }

  if (minAddress === Infinity) {
    throw new Error('No data found in HEX file');
  }

  // Create contiguous binary blob
  const length = maxAddress - minAddress + 1;
  const data = new Uint8Array(length);
  data.fill(0xFF); // Flash defaults to 0xFF
  
  for (const [addr, byte] of dataMap.entries()) {
    data[addr - minAddress] = byte;
  }

  return {
    data,
    startAddress: minAddress,
    endAddress: maxAddress
  };
}
