// Athena AI Integration for AR3S IDE
import { getEditorValue } from './ide.js';

let currentGeneratedCode = '';
let currentWiringDiagram = [];

// Initialize AI functionality
function initAthenaAI() {
  const aiFab = document.getElementById('aiFab');
  const aiModal = document.getElementById('aiModal');
  const closeBtn = document.getElementById('closeAiModal');
  const generateBtn = document.getElementById('generateBtn');
  const putInIdeBtn = document.getElementById('putInIdeBtn');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');
  const aiPrompt = document.getElementById('aiPrompt');

  // Open AI modal via FAB
  aiFab.addEventListener('click', () => {
    aiModal.style.display = 'flex';
    aiPrompt.focus();
  });

  // Close AI modal
  closeBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  aiModal.addEventListener('click', (e) => {
    if (e.target === aiModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aiModal.style.display === 'flex') {
      closeModal();
    }
  });

  // Generate code with AI
  generateBtn.addEventListener('click', generateCode);
  
  // Allow Enter to submit (Shift+Enter for new line)
  aiPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateCode();
    }
  });

  // Put generated code in IDE
  putInIdeBtn.addEventListener('click', putCodeInIDE);

  // Generate pinout diagram
  generatePinoutBtn.addEventListener('click', generatePinout);
}

function closeModal() {
  const aiModal = document.getElementById('aiModal');
  aiModal.style.display = 'none';
  
  // Reset UI state
  document.getElementById('aiResult').style.display = 'none';
  document.getElementById('aiError').style.display = 'none';
  document.getElementById('aiLoading').style.display = 'none';
  document.getElementById('wiringDiagramContainer').style.display = 'none';
}

async function generateCode() {
  const aiPrompt = document.getElementById('aiPrompt');
  const aiLoading = document.getElementById('aiLoading');
  const aiError = document.getElementById('aiError');
  const aiResult = document.getElementById('aiResult');
  const generatedCodeEl = document.getElementById('generatedCode');
  const generateBtn = document.getElementById('generateBtn');
  const wiringDiagramContainer = document.getElementById('wiringDiagramContainer');
  
  const prompt = aiPrompt.value.trim();
  if (!prompt) {
    showError('Please enter a prompt');
    return;
  }

  // Get selected mode
  const mode = document.querySelector('input[name="aiMode"]:checked').value;
  
  // Get existing code if in debug mode
  const existingCode = mode === 'debug' ? getEditorValue() : '';

  // Show loading state with glitch animation
  aiLoading.style.display = 'flex';
  aiError.style.display = 'none';
  aiResult.style.display = 'none';
  wiringDiagramContainer.style.display = 'none';
  generateBtn.disabled = true;

  try {
    const response = await fetch('/api/copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userPrompt: prompt,
        mode,
        existingCode
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.firmware_code) {
      currentGeneratedCode = data.firmware_code;
      currentWiringDiagram = data.wiring_diagram || [];
      generatedCodeEl.textContent = data.firmware_code;
      aiResult.style.display = 'block';
      
      // Show success notification
      showSuccessNotification();
    } else {
      throw new Error('No firmware code generated');
    }
  } catch (error) {
    console.error('AI generation error:', error);
    showError(`Failed to generate code: ${error.message}`);
  } finally {
    aiLoading.style.display = 'none';
    generateBtn.disabled = false;
  }
}

async function generatePinout() {
  const aiLoading = document.getElementById('aiLoading');
  const aiError = document.getElementById('aiError');
  const wiringDiagramContainer = document.getElementById('wiringDiagramContainer');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');

  // If we already have wiring diagram data, just visualize it
  if (currentWiringDiagram && currentWiringDiagram.length > 0) {
    visualizeWiringDiagram(currentWiringDiagram);
    wiringDiagramContainer.style.display = 'block';
    return;
  }

  // Otherwise, fetch pinout diagram from server
  aiLoading.style.display = 'flex';
  aiError.style.display = 'none';
  generatePinoutBtn.disabled = true;

  try {
    const response = await fetch('/api/copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userPrompt: 'Generate Arduino pinout diagram for current code',
        mode: 'diagram',
        existingCode: currentGeneratedCode || getEditorValue()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.wiring_diagram) {
      currentWiringDiagram = data.wiring_diagram;
      visualizeWiringDiagram(data.wiring_diagram);
      wiringDiagramContainer.style.display = 'block';
    } else {
      throw new Error('No wiring diagram generated');
    }
  } catch (error) {
    console.error('Pinout generation error:', error);
    showError(`Failed to generate pinout diagram: ${error.message}`);
  } finally {
    aiLoading.style.display = 'none';
    generatePinoutBtn.disabled = false;
  }
}

function visualizeWiringDiagram(wiringData) {
  const container = document.getElementById('wiringDiagram');
  container.innerHTML = ''; // Clear previous diagram
  
  if (!wiringData || wiringData.length === 0) {
    container.innerHTML = '<p class="no-data">No wiring diagram data available</p>';
    return;
  }

  // Create a simple visual representation
  // Note: For a full React Flow implementation, we'd need to set up React properly
  // This is a simpler SVG-based visualization that matches the cyberpunk theme
  
  const diagramHtml = document.createElement('div');
  diagramHtml.className = 'wiring-visual';
  
  wiringData.forEach((connection, index) => {
    const connectionDiv = document.createElement('div');
    connectionDiv.className = 'connection-item';
    connectionDiv.style.animationDelay = `${index * 0.1}s`;
    
    let html = `
      <div class="connection-line" style="border-color: ${connection.color || '#00d9ff'}">
        <div class="connection-source">${connection.source}</div>
        ${connection.intermediate_component ? `
          <div class="intermediate-component">
            <span class="component-icon">⚡</span>
            <span class="component-label">${connection.intermediate_component.type}</span>
            <span class="component-value">${connection.intermediate_component.value || ''}</span>
          </div>
        ` : ''}
        <div class="connection-arrow">→</div>
        <div class="connection-target">${connection.target}</div>
      </div>
      <div class="connection-label" style="color: ${connection.color || '#00d9ff'}">${connection.label}</div>
    `;
    
    connectionDiv.innerHTML = html;
    diagramHtml.appendChild(connectionDiv);
  });
  
  container.appendChild(diagramHtml);
}

function putCodeInIDE() {
  if (!currentGeneratedCode) {
    showError('No code to inject');
    return;
  }

  // Check if editor is available
  if (window._ar3sEditor) {
    window._ar3sEditor.setValue(currentGeneratedCode);
    
    // Show injection success notification
    showInjectionNotification();
    
    // Close modal after a short delay
    setTimeout(() => {
      closeModal();
    }, 800);
  } else {
    showError('Editor not ready. Please try again.');
  }
}

function showError(message) {
  const aiError = document.getElementById('aiError');
  aiError.innerHTML = `
    <div class="error-icon">⚠</div>
    <div class="error-text">${message}</div>
  `;
  aiError.style.display = 'block';
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    aiError.style.display = 'none';
  }, 5000);
}

function showSuccessNotification() {
  const notification = document.getElementById('successNotification');
  notification.style.display = 'flex';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function showInjectionNotification() {
  const notification = document.getElementById('injectionNotification');
  notification.style.display = 'flex';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAthenaAI);
} else {
  initAthenaAI();
}
