// Shared utilities for serial port communication

// Timeout constants
export const SYNC_TIMEOUT = 500;
export const READ_TIMEOUT = 1000;
export const RESPONSE_TIMEOUT = 2000;
export const PROGRAM_TIMEOUT = 5000;

/**
 * Read from serial port with timeout
 * @param {ReadableStreamDefaultReader} reader - Serial port reader
 * @param {number} length - Number of bytes to read
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Uint8Array>}
 */
export async function readWithTimeout(reader, length, timeout = READ_TIMEOUT) {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Read timeout')), timeout)
  );
  
  const buffer = [];
  const readPromise = (async () => {
    while (buffer.length < length) {
      const { value, done } = await reader.read();
      if (done) throw new Error('Stream closed');
      buffer.push(...value);
    }
    return new Uint8Array(buffer.slice(0, length));
  })();
  
  return Promise.race([readPromise, timeoutPromise]);
}
