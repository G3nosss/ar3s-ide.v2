// Minimal Monaco setup; no bundler to keep size low
// Loads a basic Arduino sketch template and lets user download .ino
const initialSketch = `#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
`;

export function getEditorValue() {
  return window._ar3sEditor?.getValue() || '';
}

// Shared button handlers to avoid duplication
function setupButtonHandlers() {
  document.getElementById('downloadBtn').addEventListener('click', () => {
    const code = window._ar3sEditor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sketch.ino';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    window._ar3sEditor.setValue('');
  });
}

function setupMonaco() {
  // Check if window.require is available
  if (typeof window.require === 'undefined') {
    console.warn('Monaco Editor loader not available. Using fallback editor.');
    
    // Create a fallback editor object with proper state management
    let currentValue = initialSketch;
    window._ar3sEditor = {
      getValue: () => currentValue,
      setValue: (value) => {
        currentValue = value;
        console.log('Fallback editor setValue called');
      }
    };
    
    setupButtonHandlers();
    return;
  }
  
  try {
    window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
    window.require(['vs/editor/editor.main'], () => {
      window._ar3sEditor = monaco.editor.create(document.getElementById('editor'), {
        value: initialSketch,
        language: 'cpp',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false }
      });

      setupButtonHandlers();
    }, (err) => {
      console.error('Failed to load Monaco Editor:', err);
      // Fallback if Monaco fails to load
      let currentValue = initialSketch;
      window._ar3sEditor = {
        getValue: () => currentValue,
        setValue: (value) => {
          currentValue = value;
          console.log('Fallback editor setValue called');
        }
      };
      setupButtonHandlers();
    });
  } catch (error) {
    console.error('Error initializing Monaco Editor:', error);
    // Fallback on exception
    let currentValue = initialSketch;
    window._ar3sEditor = {
      getValue: () => currentValue,
      setValue: (value) => {
        currentValue = value;
        console.log('Fallback editor setValue called');
      }
    };
    setupButtonHandlers();
  }
}
setupMonaco();