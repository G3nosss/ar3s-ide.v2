# Athena AI Integration

## Overview

Athena AI is an intelligent code generation and debugging assistant built into the AR3S IDE. It leverages advanced language models to help developers write, debug, and understand Arduino firmware code with visual pinout diagrams.

## Features

### 1. Neural Link Interface
- **Cyberpunk-styled modal** with neon cyan accents and glitch effects
- **Floating Action Button (FAB)** in bottom-right corner with pulse animation
- **Terminal-style loading** animations during code generation
- **Firmware Synthesis Complete** notifications with success animations

### 2. Code Generation Modes

#### Generate Mode
Generate new Arduino code from natural language prompts:
```
Example: "Create a blink program with 2 LEDs on pins 12 and 13"
```

Features:
- Natural language to Arduino C++ code translation
- Automatic pin definitions and setup code
- Serial debugging output included
- Professional code structure with comments

#### Debug Mode
Debug existing code with intelligent suggestions:
```
Analyzes current editor code and provides:
- Serial debugging tips
- Common issue identification
- Pin connection verification
- Timing issue detection
```

### 3. Wiring Diagram Visualization

The AI generates structured wiring diagrams showing:
- **Pin connections** with color-coded labels
- **Intermediate components** (resistors, capacitors, etc.)
- **Signal flow** with directional arrows
- **Component values** and specifications

Example wiring structure:
```json
{
  "source": "Arduino Pin 12",
  "target": "LED (Anode)",
  "label": "Digital Output",
  "color": "#00d9ff",
  "intermediate_component": {
    "type": "resistor",
    "value": "220Ω",
    "position": "between"
  }
}
```

### 4. Code Injection
One-click code injection into the IDE editor with:
- Success notification animation
- Automatic modal dismissal
- Editor focus and syntax highlighting

## User Interface

### Floating Action Button (FAB)
Located in the bottom-right corner with:
- **Neon cyan gradient** background
- **Pulsing glow** animation (2s cycle)
- **Brain/layers icon** representing neural processing
- **Hover effects** with scale and rotation

### Neural Link Modal
Cyberpunk-themed interface featuring:
- **Header**: "⚡ NEURAL LINK :: ATHENA AI"
- **Mode selector**: Generate or Debug radio buttons
- **System prompt**: Large textarea for natural language input
- **Action button**: "INITIATE SYNTHESIS" with gradient background
- **Loading state**: "PROCESSING" with glitch text effect and progress bar
- **Result section**: "FIRMWARE SYNTHESIS COMPLETE" with green checkmark

### Wiring Diagram Canvas
Visual representation showing:
- Color-coded connection lines
- Component cards with icons
- Directional flow indicators
- Connection labels and descriptions

## API Endpoint

### POST /api/copilot

**Request:**
```json
{
  "userPrompt": "Create a blink program with 2 LEDs",
  "mode": "generate",
  "existingCode": "optional code for debug mode"
}
```

**Response:**
```json
{
  "success": true,
  "firmware_code": "Generated Arduino code...",
  "wiring_diagram": [
    {
      "source": "Arduino Pin 12",
      "target": "LED (Anode)",
      "label": "Digital Output",
      "color": "#00d9ff",
      "intermediate_component": {
        "type": "resistor",
        "value": "220Ω",
        "position": "between"
      }
    }
  ],
  "mode": "generate"
}
```

**Modes:**
- `generate` - Create new code from prompt
- `debug` - Debug existing code
- `diagram` / `pinout` - Generate pinout diagram

## Usage

### 1. Access Athena AI
Click the glowing FAB button in the bottom-right corner of the IDE page.

### 2. Enter Your Prompt
Type a natural language description:
- "Create a temperature sensor with LCD display"
- "Add button debouncing to pin 2"
- "Make an RGB LED fade effect"

### 3. Select Mode
Choose between:
- **Generate Code**: Create new firmware from scratch
- **Debug Code**: Analyze and fix existing code

### 4. Initiate Synthesis
Click "INITIATE SYNTHESIS" to process your request. Watch the cyberpunk loading animation.

### 5. Review Results
- View generated code in the preview panel
- Check the wiring diagram for hardware connections
- Click "PUT IN IDE" to inject code into editor
- Click "GENERATE PINOUT DIAGRAM" to visualize connections

## Styling & Theme

### Color Palette
- **Primary Cyan**: `#00d9ff` - Main accent color
- **Secondary Purple**: `#7c4dff` - Complementary accent
- **Neon Pink**: `#ff006e` - Error/warning states
- **Success Green**: `#00ff88` - Success states
- **Dark Background**: `#0b0f14` - Base background
- **Panel Background**: `#11151b` - Component background

### Animations
- **Pulse**: 2s ease-in-out infinite for FAB
- **Glitch**: 0.3s random offset for text effects
- **Slide**: 0.5s ease for modal appearance
- **Fade In**: 0.5s for result items
- **Loading Bar**: 1.5s continuous gradient animation

### Typography
- **Font Family**: 'Courier New', monospace for cyberpunk feel
- **Headers**: Uppercase with letter-spacing
- **Code**: Monospace with syntax-like coloring

## Error Handling

The system provides user-friendly error messages for:
- **Empty prompts**: "Please enter a prompt"
- **Network errors**: "Failed to generate code: [error details]"
- **Server errors**: "HTTP error! status: [code]"
- **Editor not ready**: "Editor not ready. Please try again."

Errors are displayed with:
- Warning icon (⚠)
- Red background tint
- Shake animation
- Auto-dismiss after 5 seconds

## Browser Compatibility

Athena AI requires:
- Modern browser with ES6 module support
- Fetch API support
- CSS Grid and Flexbox
- CSS custom properties (variables)
- CSS animations and transitions

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Future Enhancements

Potential improvements:
- [ ] AI model selection (GPT-4, Claude, etc.)
- [ ] Code optimization suggestions
- [ ] Library recommendations
- [ ] Advanced circuit simulations
- [ ] Multi-file project support
- [ ] Code versioning and history
- [ ] Community prompt templates
- [ ] Real-time collaboration

## Troubleshooting

### FAB Button Not Responding
- Check browser console for JavaScript errors
- Ensure all CDN resources loaded properly
- Verify server is running on correct port

### Code Generation Fails
- Check server logs for backend errors
- Verify API endpoint is accessible
- Test with simple prompt first

### Wiring Diagram Not Showing
- Ensure response includes `wiring_diagram` array
- Check browser console for rendering errors
- Verify CSS styles are loaded

## Support

For issues or questions:
- GitHub: https://github.com/G3nosss/ar3s-ide.v2/issues
- Documentation: /docs/SERVER_SETUP.md
