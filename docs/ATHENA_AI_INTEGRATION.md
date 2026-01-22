# Athena AI Integration Documentation

## Overview

Athena AI is an intelligent coding assistant integrated into the AR3S IDE v.2. It provides AI-powered code generation, debugging assistance, and hardware configuration guidance for Arduino development.

## Features

### 1. Code Generation
- **Description**: Generate Arduino code from natural language prompts
- **Use Case**: Quickly create boilerplate code, common patterns, or complete sketches
- **Example Prompt**: "Create a program to read temperature from DHT22 sensor on pin 7"

### 2. Code Debugging
- **Description**: Analyze existing code and provide intelligent debugging suggestions
- **Use Case**: Identify issues, add serial debugging, improve code quality
- **Example Prompt**: Select debug mode and let AI analyze your code

### 3. Pinout Diagrams
- **Description**: Generate hardware configuration diagrams and pin mappings
- **Use Case**: Understand Arduino pin assignments and create wiring documentation
- **Example**: Click "Generate Pinout Diagram" to see Arduino board configurations

## Architecture

### Frontend Components

#### 1. Modal UI (`pages/ide.html`)
```html
<div id="aiModal" class="ai-modal">
  - Mode selector (Generate/Debug)
  - Prompt input textarea
  - Generate button
  - Result display
  - Action buttons (Put in IDE, Generate Pinout)
</div>
```

#### 2. JavaScript Integration (`assets/athena-ai.js`)
```javascript
Key Functions:
- initAthenaAI()        // Initialize event listeners
- generateCode()        // Call AI API to generate code
- generatePinout()      // Generate pinout diagrams
- putCodeInIDE()        // Insert code into Monaco editor
- showSuccessNotification()  // User feedback
```

#### 3. Styling (`assets/styles.css`)
- Cyberpunk/sci-fi theme
- Gradient buttons with glow effects
- Smooth animations
- Responsive design

### Backend API

#### Endpoint: POST /api/copilot

**Request Format:**
```json
{
  "prompt": "User's natural language prompt",
  "mode": "generate | debug | pinout",
  "existingCode": "Optional: code to debug"
}
```

**Response Format:**
```json
{
  "success": true,
  "code": "Generated Arduino code",
  "mode": "generate"
}
```

**Implementation:** `server/index.cjs` (lines 58-153)

## Usage Guide

### For End Users

1. **Open the IDE**
   - Navigate to http://localhost:8081/pages/ide.html

2. **Click "⚡ Athena AI" button**
   - Located in the toolbar next to Clear button

3. **Select Mode**
   - **Generate Code**: Create new code from scratch
   - **Debug Code**: Improve existing code

4. **Enter Prompt**
   - Be specific about what you want
   - Example: "Create a servo motor control program on pin 9"

5. **Generate**
   - Click "Generate with AI"
   - Wait for Athena to generate the code

6. **Use Results**
   - **Put in IDE**: Insert code directly into the editor
   - **Generate Pinout Diagram**: Create hardware configuration

### For Developers

#### Adding New AI Modes

1. **Update backend** (`server/index.cjs`):
```javascript
if (mode === "your_new_mode") {
  generatedCode = "Your logic here";
}
```

2. **Update frontend** (`assets/athena-ai.js`):
```javascript
// Add mode selector in modal
// Add corresponding event handler
```

3. **Update UI** (`pages/ide.html`):
```html
<label>
  <input type="radio" name="aiMode" value="your_new_mode">
  <span>Your New Mode</span>
</label>
```

#### Customizing AI Responses

Edit the response generation in `server/index.cjs`:
```javascript
app.post("/api/copilot", (req, res) => {
  // Customize delay
  setTimeout(() => {
    // Customize response format
    let generatedCode = "Your custom logic";
    res.json({ success: true, code: generatedCode });
  }, 1500);
});
```

## API Reference

### JavaScript API

#### `initAthenaAI()`
Initializes all event listeners for the Athena AI modal.

**Call:** Automatically called on page load

#### `generateCode()`
Calls the AI API to generate code based on user prompt.

**Flow:**
1. Validates prompt input
2. Shows loading spinner
3. Calls POST /api/copilot
4. Displays generated code
5. Enables action buttons

#### `putCodeInIDE()`
Inserts generated code into the Monaco editor.

**Requirements:**
- `window._ar3sEditor` must be initialized
- Generated code must be available

#### `generatePinout()`
Generates Arduino pinout diagram based on current/generated code.

**API Call:**
```javascript
fetch('/api/copilot', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Generate Arduino pinout diagram',
    mode: 'pinout',
    existingCode: getEditorValue()
  })
})
```

## Styling Guide

### CSS Variables
```css
--accent: #00d9ff;      /* Cyan accent color */
--accent2: #7c4dff;     /* Purple accent color */
--bg: #0b0f14;          /* Background color */
--panel: #11151b;       /* Panel background */
--text: #c9d1d9;        /* Text color */
```

### Key Classes
- `.ai-modal`: Main modal container
- `.ai-modal-content`: Modal content wrapper
- `.ai-prompt`: Prompt textarea
- `.generate-btn`: Primary action button
- `.put-in-ide-btn`: Insert code button
- `.generate-pinout-btn`: Pinout diagram button

## Testing

### Manual Testing Checklist

- [ ] Homepage displays Athena AI section
- [ ] AI button opens modal
- [ ] Mode selector switches between Generate/Debug
- [ ] Prompt textarea accepts input
- [ ] Generate button calls API
- [ ] Loading spinner appears during generation
- [ ] Generated code displays correctly
- [ ] "Put in IDE" inserts code into editor
- [ ] "Generate Pinout Diagram" works
- [ ] Success notification appears
- [ ] Modal closes properly
- [ ] Escape key closes modal
- [ ] Clicking outside closes modal

### API Testing

```bash
# Test generate mode
curl -X POST http://localhost:8081/api/copilot \
  -H "Content-Type: application/json" \
  -d '{"prompt": "LED blink", "mode": "generate"}'

# Test debug mode
curl -X POST http://localhost:8081/api/copilot \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Debug", "mode": "debug", "existingCode": "void setup(){}"}'

# Test pinout mode
curl -X POST http://localhost:8081/api/copilot \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Pinout", "mode": "pinout"}'
```

## Troubleshooting

### Issue: Modal doesn't open
**Solution:** Check browser console for JavaScript errors. Ensure `athena-ai.js` is loaded.

### Issue: API returns error
**Solution:** 
1. Verify server is running: `curl http://localhost:8081/api/copilot`
2. Check server logs for errors
3. Ensure request format is correct

### Issue: "Put in IDE" doesn't work
**Solution:** Ensure Monaco editor is initialized. Check that `window._ar3sEditor` exists in console.

### Issue: Loading spinner never stops
**Solution:** 
1. Check network tab for failed requests
2. Verify backend is responding
3. Check for JavaScript errors in console

## Future Enhancements

### Planned Features
- [ ] Real-time code suggestions as you type
- [ ] Integration with actual AI models (OpenAI, Claude, etc.)
- [ ] Code explanation and documentation generation
- [ ] Library recommendation based on requirements
- [ ] Optimization suggestions
- [ ] Security vulnerability scanning
- [ ] Unit test generation
- [ ] Multi-language support (ESP32, STM32)

### Integration Ideas
- Connect to OpenAI API for real AI responses
- Add code history and versioning
- Implement code snippets library
- Add collaborative features
- Create AI learning from user corrections

## Security Considerations

1. **Input Validation**: Always validate user prompts on the backend
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **API Key Management**: If using external AI services, secure API keys
4. **Code Sanitization**: Sanitize generated code before insertion
5. **CORS Configuration**: Properly configure CORS for API endpoints

## Performance Optimization

1. **Caching**: Cache common AI responses
2. **Lazy Loading**: Load AI modal only when needed
3. **Debouncing**: Debounce prompt input for auto-suggestions
4. **Code Splitting**: Split AI logic into separate bundle
5. **CDN**: Use CDN for static assets

## Contributing

To contribute to Athena AI:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/athena-enhancement`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This feature is part of AR3S IDE v.2 and is licensed under AGPL-3.0.

## Support

For issues or questions:
- GitHub Issues: https://github.com/G3nosss/ar3s-ide.v2/issues
- Documentation: https://github.com/G3nosss/ar3s-ide.v2/docs

---

*Last Updated: 2026-01-22*
*Version: 1.0.0*
