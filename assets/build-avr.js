import { getEditorValue } from './ide.js';

const buildBtn = document.getElementById('buildAvrBtn');
const logEl = document.getElementById('buildLog');

/**
 * Build hex file for a specific board
 * @param {string} code - Arduino sketch code
 * @param {string} fqbn - Fully Qualified Board Name
 * @returns {Promise<{artifactUrl: string, log: string}>}
 */
export async function buildHex(code, fqbn) {
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
  return {
    artifactUrl: data.artifactUrl,
    log: data.log || 'Build completed.'
  };
}

async function buildAvr() {
  logEl.textContent = 'Submitting build job...';
  const code = getEditorValue();
  
  // Get selected board from dropdown (if available)
  const boardSelect = document.getElementById('boardSelect');
  const fqbn = boardSelect?.value ? 
    document.querySelector(`#boardSelect option[value="${boardSelect.value}"]`)?.dataset.fqbn || 'arduino:avr:uno' :
    'arduino:avr:uno';

  try {
    const result = await buildHex(code, fqbn);
    logEl.textContent = result.log;

    if (result.artifactUrl) {
      const a = document.createElement('a');
      a.href = result.artifactUrl;
      a.textContent = 'Download .hex';
      a.download = 'firmware.hex';
      a.className = 'btn';
      logEl.appendChild(document.createElement('br'));
      logEl.appendChild(a);
    }
  } catch (err) {
    logEl.textContent = `Error: ${err?.message || err}`;
  }
}

buildBtn?.addEventListener('click', () => {
  buildAvr().catch(err => {
    logEl.textContent = `Error: ${err?.message || err}`;
  });
});
