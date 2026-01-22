// Athena AI Integration for AR3S IDE
import { getEditorValue } from './ide.js';

let currentGeneratedCode = '';

// Initialize AI functionality
function initAthenaAI() {
  const aiBtn = document.getElementById('aiBtn');
  const aiModal = document.getElementById('aiModal');
  const closeBtn = document.getElementById('closeAiModal');
  const generateBtn = document.getElementById('generateBtn');
  const putInIdeBtn = document.getElementById('putInIdeBtn');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');
  const aiPrompt = document.getElementById('aiPrompt');

  // Open AI modal
  aiBtn.addEventListener('click', () => {
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
}

async function generateCode() {
  const aiPrompt = document.getElementById('aiPrompt');
  const aiLoading = document.getElementById('aiLoading');
  const aiError = document.getElementById('aiError');
  const aiResult = document.getElementById('aiResult');
  const generatedCodeEl = document.getElementById('generatedCode');
  const generateBtn = document.getElementById('generateBtn');
  
  const prompt = aiPrompt.value.trim();
  if (!prompt) {
    showError('Please enter a prompt');
    return;
  }

  // Get selected mode
  const mode = document.querySelector('input[name="aiMode"]:checked').value;
  
  // Get existing code if in debug mode
  const existingCode = mode === 'debug' ? getEditorValue() : '';

  // Show loading state
  aiLoading.style.display = 'flex';
  aiError.style.display = 'none';
  aiResult.style.display = 'none';
  generateBtn.disabled = true;

  try {
    const response = await fetch('/api/copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        mode,
        existingCode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.code) {
      currentGeneratedCode = data.code;
      generatedCodeEl.textContent = data.code;
      aiResult.style.display = 'block';
    } else {
      throw new Error('No code generated');
    }
  } catch (error) {
    console.error('AI generation error:', error);
    showError('Failed to generate code. Please try again.');
  } finally {
    aiLoading.style.display = 'none';
    generateBtn.disabled = false;
  }
}

async function generatePinout() {
  const aiLoading = document.getElementById('aiLoading');
  const aiError = document.getElementById('aiError');
  const aiResult = document.getElementById('aiResult');
  const generatedCodeEl = document.getElementById('generatedCode');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');

  // Show loading state
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
        prompt: 'Generate Arduino pinout diagram',
        mode: 'pinout',
        existingCode: getEditorValue()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.code) {
      currentGeneratedCode = data.code;
      generatedCodeEl.textContent = data.code;
      aiResult.style.display = 'block';
    } else {
      throw new Error('No pinout generated');
    }
  } catch (error) {
    console.error('Pinout generation error:', error);
    showError('Failed to generate pinout diagram. Please try again.');
  } finally {
    aiLoading.style.display = 'none';
    generatePinoutBtn.disabled = false;
  }
}

function putCodeInIDE() {
  if (!currentGeneratedCode) {
    showError('No code to inject');
    return;
  }

  // Check if editor is available
  if (window._ar3sEditor) {
    window._ar3sEditor.setValue(currentGeneratedCode);
    
    // Show success notification
    showSuccessNotification();
    
    // Close modal after a short delay
    setTimeout(() => {
      closeModal();
    }, 500);
  } else {
    showError('Editor not ready. Please try again.');
  }
}

function showError(message) {
  const aiError = document.getElementById('aiError');
  aiError.textContent = message;
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAthenaAI);
} else {
  initAthenaAI();
}
