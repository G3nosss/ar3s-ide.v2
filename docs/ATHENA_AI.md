# Athena AI Assistant Documentation

## Overview

Athena AI is an intelligent code generation and debugging assistant integrated into the AR3S IDE. It helps developers write Arduino code faster by generating code from natural language prompts, debugging existing code, and creating pinout diagrams.

## Features

### 1. Home Page Presence
The home page includes a dedicated "ATHENA AI ASSISTANT" section that describes the AI capabilities:
- **Generate Arduino code** from natural language prompts
- **Debug existing code** with intelligent suggestions
- **Create pinout diagrams** and hardware configurations
- **Optimize code** for performance and memory efficiency

### 2. IDE Integration

#### AI Modal Interface
- **Access**: Click the "⚡ Athena AI" button in the IDE toolbar
- **Modes**:
  - **Generate Code**: Create new Arduino code from a text prompt
  - **Debug Code**: Analyze and suggest improvements for existing code in the editor

#### User Workflow
1. Click "⚡ Athena AI" button to open the modal
2. Select mode (Generate Code or Debug Code)
3. Enter a prompt describing what you want to accomplish
4. Click "Generate with AI" to get code suggestions
5. Review the generated code in the preview area
6. Click "Put in IDE" to insert code into the editor
7. Click "Generate Pinout Diagram" to get hardware wiring information

## Backend API

### Endpoint: `/api/copilot`

**Method**: POST

**Request Body**:
```json
{
  "prompt": "string - User's natural language request",
  "mode": "string - 'generate' | 'debug' | 'pinout'",
  "existingCode": "string - Current code in editor (for debug mode)"
}
```

**Response**:
```json
{
  "success": true,
  "code": "string - Generated Arduino code",
  "mode": "string - The mode used"
}
```

### Current Implementation

The current implementation in `server/index.cjs` provides a **mock/simulated AI** that:
- Returns template-based code for "generate" mode
- Adds debugging comments for "debug" mode
- Provides Arduino pinout diagrams for "pinout" mode

### Integration with Real AI Services

To integrate with a real AI service (OpenAI, Anthropic, etc.), replace the mock implementation with actual API calls:

#### Option 1: OpenAI GPT
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/copilot", async (req, res) => {
  const { prompt, mode, existingCode } = req.body;
  
  let systemPrompt = "You are an Arduino programming expert.";
  let userPrompt = prompt;
  
  if (mode === "debug") {
    systemPrompt += " Analyze the following code and suggest improvements:";
    userPrompt = `${prompt}\n\nCode:\n${existingCode}`;
  } else if (mode === "pinout") {
    systemPrompt += " Generate a detailed Arduino pinout diagram.";
    userPrompt = `Based on this code, create a pinout diagram:\n${existingCode}`;
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    
    res.json({
      success: true,
      code: completion.choices[0].message.content,
      mode: mode || "generate"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Option 2: Anthropic Claude
```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/copilot", async (req, res) => {
  const { prompt, mode, existingCode } = req.body;
  
  let systemPrompt = "You are an Arduino programming expert.";
  let userMessage = prompt;
  
  if (mode === "debug") {
    userMessage = `Analyze and debug this Arduino code:\n\n${existingCode}\n\nIssue: ${prompt}`;
  } else if (mode === "pinout") {
    userMessage = `Create a pinout diagram for this Arduino code:\n\n${existingCode}`;
  }
  
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: userMessage }],
      system: systemPrompt
    });
    
    res.json({
      success: true,
      code: message.content[0].text,
      mode: mode || "generate"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Environment Variables

Add to your `.env` file:
```bash
# For OpenAI
OPENAI_API_KEY=sk-...

# For Anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### Security Considerations

1. **API Key Protection**: Store API keys in environment variables, never in code
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Validate and sanitize user prompts
4. **Cost Management**: Monitor API usage and set spending limits
5. **Error Handling**: Gracefully handle API failures and timeouts

### Recommended Improvements

1. **Caching**: Cache common prompts to reduce API costs
2. **Streaming**: Implement streaming responses for better UX
3. **Context**: Maintain conversation context for follow-up questions
4. **Templates**: Pre-load common Arduino patterns and libraries
5. **Validation**: Validate generated code syntax before returning
6. **History**: Store generation history for user reference

## UI Components

### Files Modified
- `index.html` - Home page with AI showcase section
- `pages/ide.html` - IDE page with AI button and modal
- `assets/athena-ai.js` - AI functionality and API integration
- `assets/styles.css` - Styling for AI button, modal, and components
- `assets/homepage.css` - Styling for home page AI section

### Key CSS Classes
- `.ai-btn` - AI button in IDE toolbar
- `.ai-modal` - Modal overlay
- `.ai-modal-content` - Modal container
- `.ai-mode-selector` - Generate/Debug mode toggle
- `.ai-prompt` - User input textarea
- `.generated-code` - Code preview area
- `.put-in-ide-btn` - Insert code button
- `.generate-pinout-btn` - Pinout diagram button

## Testing

### Manual Testing
1. Open IDE at `/pages/ide.html`
2. Click "⚡ Athena AI" button
3. Enter a prompt like "Create a blink program"
4. Verify code generation works
5. Test "Put in IDE" button inserts code
6. Test "Generate Pinout Diagram" creates diagrams

### Future Automated Tests
Consider adding:
- Unit tests for AI integration
- E2E tests for modal interaction
- API endpoint tests
- Code validation tests

## Browser Compatibility

The AI features use modern JavaScript features:
- Fetch API for AJAX requests
- ES6+ syntax (async/await, arrow functions)
- CSS Grid and Flexbox for layout

**Supported Browsers**:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## License

This feature is part of the AR3S IDE v2 project, licensed under AGPL-3.0.

## Support

For issues or questions about Athena AI:
1. Check this documentation
2. Review the code in `assets/athena-ai.js`
3. Open an issue on the GitHub repository
4. Contact the maintainers
