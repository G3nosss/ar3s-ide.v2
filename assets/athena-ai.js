// Athena AI Integration for AR3S IDE
import { getEditorValue } from './ide.js';

let currentGeneratedCode = '';
let currentWiringDiagram = null;

// Initialize AI functionality
function initAthenaAI() {
  const aiFab = document.getElementById('aiFab');
  const aiModal = document.getElementById('aiModal');
  const closeBtn = document.getElementById('closeAiModal');
  const generateBtn = document.getElementById('generateBtn');
  const putInIdeBtn = document.getElementById('putInIdeBtn');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');
  const closePinoutBtn = document.getElementById('closePinoutBtn');
  const aiPrompt = document.getElementById('aiPrompt');

  // Open AI modal from FAB
  if (aiFab) {
    aiFab.addEventListener('click', () => {
      aiModal.style.display = 'flex';
      aiPrompt.focus();
    });
  }

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
  generatePinoutBtn.addEventListener('click', showPinoutDiagram);
  
  // Close pinout diagram
  if (closePinoutBtn) {
    closePinoutBtn.addEventListener('click', closePinoutDiagram);
  }
}

function closeModal() {
  const aiModal = document.getElementById('aiModal');
  aiModal.style.display = 'none';
  
  // Reset UI state
  document.getElementById('aiResult').style.display = 'none';
  document.getElementById('aiError').style.display = 'none';
  document.getElementById('aiLoading').style.display = 'none';
  document.getElementById('pinoutVisualization').style.display = 'none';
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

  // Hide previous results
  document.getElementById('pinoutVisualization').style.display = 'none';

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
        userPrompt: prompt,
        mode,
        existingCode
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.firmware_code) {
      currentGeneratedCode = data.firmware_code;
      currentWiringDiagram = data.wiring_diagram;
      generatedCodeEl.textContent = data.firmware_code;
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

function showPinoutDiagram() {
  if (!currentWiringDiagram) {
    showError('No wiring diagram available. Generate code first.');
    return;
  }

  const pinoutVisualization = document.getElementById('pinoutVisualization');
  const pinoutCanvas = document.getElementById('pinoutCanvas');
  
  // Show the visualization container
  pinoutVisualization.style.display = 'block';
  
  // Clear previous content
  pinoutCanvas.innerHTML = '';
  
  // Check if React Flow is available
  if (typeof ReactFlow === 'undefined') {
    // Fallback: render simple text-based diagram
    renderTextDiagram(pinoutCanvas, currentWiringDiagram);
    return;
  }
  
  // Render React Flow diagram
  renderReactFlowDiagram(pinoutCanvas, currentWiringDiagram);
}

function renderTextDiagram(container, wiringDiagram) {
  const diagramText = document.createElement('pre');
  diagramText.style.color = 'var(--accent)';
  diagramText.style.padding = '1rem';
  diagramText.style.fontFamily = "'Courier New', monospace";
  
  let text = '╔════════════════════════════════╗\n';
  text += '║      WIRING CONNECTIONS        ║\n';
  text += '╚════════════════════════════════╝\n\n';
  
  if (wiringDiagram.edges && wiringDiagram.nodes) {
    const nodeMap = {};
    wiringDiagram.nodes.forEach(node => {
      nodeMap[node.id] = node.data.label;
    });
    
    wiringDiagram.edges.forEach(edge => {
      const source = nodeMap[edge.source] || edge.source;
      const target = nodeMap[edge.target] || edge.target;
      const label = edge.label || '';
      const intermediate = edge.data?.intermediate_component;
      
      if (intermediate) {
        text += `${source} ──[${label}]──> [${intermediate}] ──> ${target}\n`;
      } else {
        text += `${source} ──[${label}]──> ${target}\n`;
      }
    });
  }
  
  diagramText.textContent = text;
  container.appendChild(diagramText);
}

function renderReactFlowDiagram(container, wiringDiagram) {
  // Create a root div for React
  const rootDiv = document.createElement('div');
  rootDiv.id = 'react-flow-root';
  rootDiv.style.width = '100%';
  rootDiv.style.height = '100%';
  container.appendChild(rootDiv);
  
  try {
    // Process edges to include intermediate components as nodes
    const processedData = processWiringDiagram(wiringDiagram);
    
    // Use React Flow
    const { ReactFlow, Controls, Background } = window.ReactFlow;
    
    const flowElement = React.createElement(ReactFlow, {
      nodes: processedData.nodes,
      edges: processedData.edges,
      fitView: true,
      style: { background: 'var(--panel)' },
      children: [
        React.createElement(Controls),
        React.createElement(Background, { color: 'var(--accent)', gap: 16 })
      ]
    });
    
    const root = ReactDOM.createRoot(rootDiv);
    root.render(flowElement);
  } catch (error) {
    console.error('Error rendering React Flow diagram:', error);
    // Fallback to text diagram
    container.innerHTML = '';
    renderTextDiagram(container, wiringDiagram);
  }
}

function processWiringDiagram(wiringDiagram) {
  const nodes = [...wiringDiagram.nodes];
  const edges = [];
  
  let intermediateNodeCounter = 0;
  
  wiringDiagram.edges.forEach(edge => {
    if (edge.data?.intermediate_component) {
      // Create an intermediate node
      const intermediateId = `intermediate_${intermediateNodeCounter++}`;
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        // Calculate position between source and target
        const intermediateNode = {
          id: intermediateId,
          type: 'default',
          position: {
            x: (sourceNode.position.x + targetNode.position.x) / 2,
            y: (sourceNode.position.y + targetNode.position.y) / 2
          },
          data: { label: edge.data.intermediate_component }
        };
        
        nodes.push(intermediateNode);
        
        // Split the edge into two edges
        edges.push({
          id: `${edge.id}_1`,
          source: edge.source,
          target: intermediateId,
          label: edge.label
        });
        
        edges.push({
          id: `${edge.id}_2`,
          source: intermediateId,
          target: edge.target
        });
      }
    } else {
      edges.push(edge);
    }
  });
  
  return { nodes, edges };
}

function closePinoutDiagram() {
  const pinoutVisualization = document.getElementById('pinoutVisualization');
  pinoutVisualization.style.display = 'none';
}

async function generatePinout() {
  const aiLoading = document.getElementById('aiLoading');
  const aiError = document.getElementById('aiError');
  const aiResult = document.getElementById('aiResult');
  const generatedCodeEl = document.getElementById('generatedCode');
  const generatePinoutBtn = document.getElementById('generatePinoutBtn');

  // Hide previous pinout
  document.getElementById('pinoutVisualization').style.display = 'none';

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
        userPrompt: 'Generate Arduino pinout diagram',
        mode: 'pinout',
        existingCode: getEditorValue()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.firmware_code) {
      currentGeneratedCode = data.firmware_code;
      currentWiringDiagram = data.wiring_diagram;
      generatedCodeEl.textContent = data.firmware_code;
      aiResult.style.display = 'block';
      
      // Show the pinout diagram
      if (currentWiringDiagram) {
        showPinoutDiagram();
      }
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
