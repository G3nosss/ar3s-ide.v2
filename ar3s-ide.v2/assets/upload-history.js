// Upload history manager using localStorage
// Tracks last 10 successful/failed uploads

const HISTORY_KEY = 'ar3s_upload_history';
const MAX_HISTORY = 10;

/**
 * Save upload to history
 */
export function saveUpload(uploadData) {
  const { timestamp, board, sketchName, bytes, success } = uploadData;
  
  const history = getHistory();
  
  history.unshift({
    timestamp: timestamp || Date.now(),
    board,
    sketchName: sketchName || 'Untitled',
    bytes,
    success
  });
  
  // Keep only last MAX_HISTORY items
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Get upload history
 */
export function getHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to load upload history:', err);
    return [];
  }
}

/**
 * Clear upload history
 */
export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${month} ${day} ${time}`;
}

/**
 * Format bytes for display
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Render upload history to DOM
 */
export function renderHistory(containerElement) {
  const history = getHistory();
  
  if (!history || history.length === 0) {
    containerElement.innerHTML = `
      <div class="upload-history-header" style="padding: 0.5rem;">
        <span class="muted">📜 Upload History (0)</span>
      </div>
    `;
    return;
  }
  
  const isExpanded = containerElement.dataset.expanded === 'true';
  
  containerElement.innerHTML = `
    <div class="upload-history-header" style="cursor: pointer; padding: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
      <span>📜 Upload History (${history.length})</span>
      <span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>
    </div>
    <div class="upload-history-list" style="display: ${isExpanded ? 'block' : 'none'};">
      ${history.map(item => `
        <div class="upload-history-item" style="padding: 0.5rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; align-items: center;">
          <span style="font-size: 1.2em;">${item.success ? '✅' : '❌'}</span>
          <span class="muted" style="min-width: 100px;">${formatTimestamp(item.timestamp)}</span>
          <span style="font-weight: 600; min-width: 120px;">${item.board}</span>
          <span class="muted" style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.sketchName}</span>
          <span class="muted" style="min-width: 80px; text-align: right;">${formatBytes(item.bytes)}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Add click handler for toggle
  const header = containerElement.querySelector('.upload-history-header');
  header.addEventListener('click', () => {
    const newExpanded = !isExpanded;
    containerElement.dataset.expanded = newExpanded;
    renderHistory(containerElement);
  });
}

/**
 * Get sketch name from code (first line or "Untitled")
 */
export function getSketchNameFromCode(code) {
  const MAX_SKETCH_NAME_LENGTH = 50;
  
  if (!code) return 'Untitled';
  
  const lines = code.trim().split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Look for comment with sketch name
    if (trimmed.startsWith('//')) {
      const name = trimmed.substring(2).trim();
      if (name && name.length > 0 && name.length < MAX_SKETCH_NAME_LENGTH) {
        return name;
      }
    }
    // Stop at first non-comment line
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
      break;
    }
  }
  
  return 'Untitled';
}
