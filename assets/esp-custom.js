const chipEl = document.getElementById('chip');
const offsetEl = document.getElementById('offset');
const fileEl = document.getElementById('binfile');
const prepareBtn = document.getElementById('prepareBtn');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('installBtn');

// Cleanup delay for blob URLs (1 minute)
const BLOB_CLEANUP_DELAY_MS = 60_000;

// Track current blob URLs for cleanup
let currentManifestUrl = null;
let currentFwUrl = null;

function cleanupBlobUrls() {
  if (currentManifestUrl) {
    try { URL.revokeObjectURL(currentManifestUrl); } catch {}  // Ignore if already revoked
    currentManifestUrl = null;
  }
  if (currentFwUrl) {
    try { URL.revokeObjectURL(currentFwUrl); } catch {}  // Ignore if already revoked
    currentFwUrl = null;
  }
}

function parseOffset(hexStr) {
  try {
    if (!hexStr || hexStr.trim() === '') return 0x10000;
    // Always parse as hex - with or without 0x prefix
    if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) {
      return parseInt(hexStr, 16);
    }
    return parseInt(hexStr, 16);
  } catch {
    return 0x10000;
  }
}

prepareBtn?.addEventListener('click', async () => {
  statusEl.textContent = '';
  
  // Clean up any existing blob URLs from previous preparations
  cleanupBlobUrls();
  
  const chipFamily = chipEl.value || 'ESP32';
  const file = fileEl.files?.[0];

  if (!file) {
    statusEl.textContent = 'Select a .bin file first.';
    return;
  }

  currentFwUrl = URL.createObjectURL(file);
  const offset = parseOffset(offsetEl.value);

  const manifest = {
    name: "Ar3s Custom Firmware",
    version: "custom",
    build: new Date().toISOString(),
    chipFamily,
    parts: [
      { path: currentFwUrl, offset }
    ]
  };

  const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  currentManifestUrl = URL.createObjectURL(manifestBlob);

  installBtn.setAttribute('manifest', currentManifestUrl);
  statusEl.textContent = `Prepared manifest for ${chipFamily}, offset ${'0x' + offset.toString(16)}. Click the Install button to flash.`;

  // Schedule cleanup after flashing is likely complete
  setTimeout(cleanupBlobUrls, BLOB_CLEANUP_DELAY_MS);
});
