// Athena AI Assistant Module
let currentMode = 'generate';
let generatedCode = '';

// Helper function to get editor value - handles case where editor isn't loaded
function getEditorValue() {
  return window._ar3sEditor?.getValue() || '';
}

// Initialize AI modal functionality
function initAthenaAI() {
  const modal = document.getElementById('aiModal');
  const aiAssistBtn = document.getElementById('aiAssistBtn');
  const closeBtn = document.getElementById('closeAiModal');
  const generateBtn = document.getElementById('generateBtn');
  const putInIdeBtn = document.getElementById('putInIdeBtn');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');
  const modeBtns = document.querySelectorAll('.ai-mode-btn');
  const aiPrompt = document.getElementById('aiPrompt');
  const aiOutput = document.getElementById('aiOutput');
  const aiCode = document.getElementById('aiCode');
  const aiError = document.getElementById('aiError');
  const successNotification = document.getElementById('successNotification');

  // Open modal
  aiAssistBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    aiPrompt.focus();
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    resetModal();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      resetModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      resetModal();
    }
  });

  // Mode selection
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      
      // Update placeholder based on mode
      if (currentMode === 'generate') {
        aiPrompt.placeholder = 'e.g., Create a blink LED program with adjustable delay';
        generateBtn.querySelector('.btn-text').textContent = 'Generate with AI';
      } else if (currentMode === 'debug') {
        aiPrompt.placeholder = 'e.g., Why is my serial communication not working?';
        generateBtn.querySelector('.btn-text').textContent = 'Debug with AI';
      }
    });
  });

  // Generate code
  generateBtn.addEventListener('click', async () => {
    const prompt = aiPrompt.value.trim();
    
    if (!prompt) {
      showError('Please enter a prompt');
      return;
    }

    // Show loading state
    setLoading(true);
    aiOutput.style.display = 'none';
    aiError.style.display = 'none';

    try {
      const payload = {
        prompt,
        mode: currentMode
      };

      // Include current editor code for debug mode
      if (currentMode === 'debug') {
        payload.code = getEditorValue();
      }

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate code');
      }

      const data = await response.json();
      generatedCode = data.code;

      // Display generated code
      aiCode.textContent = generatedCode;
      aiOutput.style.display = 'block';
      
    } catch (error) {
      // Handle network errors separately from API errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showError('Network error: Unable to reach the AI service. Please check your connection.');
      } else {
        showError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  });

  // Put generated code in IDE
  putInIdeBtn.addEventListener('click', () => {
    if (window._ar3sEditor && generatedCode) {
      window._ar3sEditor.setValue(generatedCode);
      modal.style.display = 'none';
      resetModal();
      showSuccessNotification();
    }
  });

  // Generate pinout diagram
  generatePinoutBtn.addEventListener('click', async () => {
    const prompt = aiPrompt.value.trim() || 'Generate a standard Arduino Uno pinout diagram';
    
    // Show loading state
    setLoading(true);
    aiError.style.display = 'none';

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          mode: 'pinout'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate pinout diagram');
      }

      const data = await response.json();
      generatedCode = data.code;

      // Display pinout code
      aiCode.textContent = generatedCode;
      aiOutput.style.display = 'block';
      
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  });

  // Helper functions
  function setLoading(isLoading) {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnSpinner = generateBtn.querySelector('.btn-spinner');
    
    if (isLoading) {
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline-block';
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.6';
    } else {
      btnText.style.display = 'inline';
      btnSpinner.style.display = 'none';
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
    }
  }

  function showError(message) {
    aiError.textContent = message;
    aiError.style.display = 'block';
    aiOutput.style.display = 'none';
  }

  function resetModal() {
    aiPrompt.value = '';
    aiOutput.style.display = 'none';
    aiError.style.display = 'none';
    generatedCode = '';
  }

  function showSuccessNotification() {
    successNotification.classList.add('show');
    setTimeout(() => {
      successNotification.classList.remove('show');
    }, 3000);
  }

  // Allow Enter key to submit (with Ctrl/Cmd for newline)
  aiPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      generateBtn.click();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAthenaAI);
} else {
  initAthenaAI();
}
