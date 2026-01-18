import { getEditorValue } from './ide.js';

const buildBtn = document.getElementById('buildAvrBtn');
const logEl = document.getElementById('buildLog');

async function buildAvr() {
  logEl.textContent = 'Submitting build job...';
  const code = getEditorValue();

  const res = await fetch('/api/build/avr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, fqbn: 'arduino:avr:uno' })
  });

  if (!res.ok) {
    const text = await res.text();
    logEl.textContent = `Build request failed: ${res.status} ${text}`;
    return;
  }

  const data = await res.json();
  logEl.textContent = data.log || 'Build completed.';

  if (data.artifactUrl) {
    const a = document.createElement('a');
    a.href = data.artifactUrl;
    a.textContent = 'Download .hex';
    a.download = 'firmware.hex';
    a.className = 'btn';
    logEl.appendChild(document.createElement('br'));
    logEl.appendChild(a);
  }
}

buildBtn?.addEventListener('click', () => {
  buildAvr().catch(err => {
    logEl.textContent = `Error: ${err?.message || err}`;
  });
});
