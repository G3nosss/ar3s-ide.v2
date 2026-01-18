const chipEl = document.getElementById('chip');
const offsetEl = document.getElementById('offset');
const fileEl = document.getElementById('binfile');
const prepareBtn = document.getElementById('prepareBtn');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('installBtn');

function parseOffset(hexStr) {
  try {
    if (!hexStr) return 0x10000;
    if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) return parseInt(hexStr, 16);
    return parseInt(hexStr);
  } catch {
    return 0x10000;
  }
}

prepareBtn?.addEventListener('click', async () => {
  statusEl.textContent = '';
  const chipFamily = chipEl.value || 'ESP32';
  const file = fileEl.files?.[0];

  if (!file) {
    statusEl.textContent = 'Select a .bin file first.';
    return;
  }

  const fwUrl = URL.createObjectURL(file);
  const offset = parseOffset(offsetEl.value);

  const manifest = {
    name: "Ar3s Custom Firmware",
    version: "custom",
    build: new Date().toISOString(),
    chipFamily,
    parts: [
      { path: fwUrl, offset }
    ]
  };

  const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  installBtn.setAttribute('manifest', manifestUrl);
  statusEl.textContent = `Prepared manifest for ${chipFamily}, offset ${'0x' + offset.toString(16)}. Click the Install button to flash.`;

  setTimeout(() => {
    try { URL.revokeObjectURL(manifestUrl); } catch {}
    setTimeout(() => { try { URL.revokeObjectURL(fwUrl); } catch {} }, 60_000);
  }, 60_000);
});
