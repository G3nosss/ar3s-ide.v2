# Athena AI Backend Integration Recommendations

## Current Implementation Status

The AR3S IDE currently includes a **mock AI backend** for demonstration purposes. The `/api/copilot` endpoint in `server/index.cjs` returns simulated code generation responses.

## Production Backend Requirements

To enable full AI functionality in production, the following backend integration is required:

### 1. AI Service Integration

**Recommended Options:**

#### Option A: OpenAI API Integration
- **Service**: OpenAI GPT-4 or GPT-3.5-turbo
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Benefits**: State-of-the-art code generation, well-documented API
- **Cost**: Pay-per-token pricing model

**Implementation Example:**
```javascript
const openai = require('openai');

async function generateCode(prompt, mode, existingCode) {
  const systemPrompt = mode === 'debug' 
    ? 'You are an expert Arduino debugging assistant. Analyze the code and provide debugging suggestions.'
    : mode === 'pinout'
    ? 'You are an expert at creating Arduino pinout diagrams and hardware configurations.'
    : 'You are an expert Arduino code generator. Generate clean, well-commented Arduino C++ code.';
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: existingCode ? `${prompt}\n\nExisting code:\n${existingCode}` : prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });
  
  return response.choices[0].message.content;
}
```

#### Option B: GitHub Copilot API
- **Service**: GitHub Copilot for Business API
- **Benefits**: Optimized for code generation, supports multiple languages
- **Cost**: Subscription-based pricing

#### Option C: Self-Hosted LLM
- **Options**: Llama 2, CodeLlama, or similar open-source models
- **Benefits**: Full control, no per-request costs after setup
- **Requirements**: GPU infrastructure (NVIDIA A100 or similar)
- **Tools**: HuggingFace Transformers, vLLM, or Text Generation Inference

### 2. Required Modifications to `server/index.cjs`

Replace the mock implementation in the `/api/copilot` endpoint:

```javascript
// Current mock implementation (lines 57-153)
app.post("/api/copilot", async (req, res) => {
  const { prompt, mode, existingCode } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Replace this with actual AI service call
    const generatedCode = await generateWithAI(prompt, mode, existingCode);
    
    res.json({
      success: true,
      code: generatedCode,
      mode: mode || "generate"
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      error: "AI generation failed", 
      details: error.message 
    });
  }
});
```

### 3. Environment Configuration

Add the following environment variables to `.env`:

```bash
# AI Service Configuration
AI_SERVICE_PROVIDER=openai  # Options: openai, github_copilot, self_hosted
OPENAI_API_KEY=sk-...       # Required if using OpenAI
OPENAI_MODEL=gpt-4          # Model to use
OPENAI_MAX_TOKENS=2000      # Maximum tokens per request

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=10
AI_RATE_LIMIT_PER_DAY=500

# Feature Flags
AI_DEBUG_MODE=false
AI_ENABLE_PINOUT=true
AI_ENABLE_DEBUG=true
```

### 4. Security Considerations

#### API Key Protection
- Store API keys in environment variables, never in code
- Use a secrets management service (AWS Secrets Manager, Azure Key Vault, etc.)
- Rotate keys regularly

#### Rate Limiting
Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many AI requests, please try again later.'
});

app.post("/api/copilot", aiLimiter, async (req, res) => {
  // ... AI logic
});
```

#### Input Validation
- Validate and sanitize all user inputs
- Limit prompt length (e.g., max 2000 characters)
- Implement content filtering for malicious prompts

#### User Authentication
Consider adding authentication:
- OAuth 2.0 integration
- JWT tokens for session management
- User quota tracking

### 5. Monitoring and Logging

Implement comprehensive logging:

```javascript
const logger = require('winston');

app.post("/api/copilot", async (req, res) => {
  const startTime = Date.now();
  
  try {
    logger.info('AI request received', {
      mode: req.body.mode,
      promptLength: req.body.prompt?.length,
      userId: req.user?.id
    });
    
    const result = await generateWithAI(...);
    
    logger.info('AI request completed', {
      duration: Date.now() - startTime,
      codeLength: result.length
    });
    
    return res.json({ success: true, code: result });
  } catch (error) {
    logger.error('AI request failed', {
      error: error.message,
      duration: Date.now() - startTime
    });
    return res.status(500).json({ error: 'Generation failed' });
  }
});
```

### 6. Cost Optimization

For OpenAI integration:
- Cache common prompts and responses
- Implement prompt compression techniques
- Use streaming for large responses
- Monitor token usage per user/session

```javascript
const cache = require('node-cache');
const promptCache = new cache({ stdTTL: 3600 }); // 1 hour cache

async function generateWithAI(prompt, mode, existingCode) {
  const cacheKey = `${mode}:${prompt}:${existingCode}`;
  
  const cached = promptCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  const result = await callAIService(prompt, mode, existingCode);
  promptCache.set(cacheKey, result);
  
  return result;
}
```

### 7. Testing Recommendations

Before production deployment:
- Load testing with concurrent AI requests
- Test rate limiting behavior
- Verify API key rotation procedures
- Test failover scenarios
- Monitor latency and error rates

### 8. Pinout Diagram Generation

For the "Generate Pinout Diagram" feature, consider:

**Option A**: Use AI to generate ASCII art diagrams (current mock approach)
**Option B**: Integrate with a diagramming library:
- Use the AI to generate structured data (JSON)
- Frontend renders the diagram using a library like:
  - `mermaid.js` for flowchart-style diagrams
  - `d3.js` for custom SVG diagrams
  - Canvas API for pixel-based rendering

**Example JSON structure:**
```json
{
  "components": [
    { "type": "LED", "pin": "D13", "label": "Status LED" },
    { "type": "Button", "pin": "D2", "label": "Input Button" }
  ],
  "connections": [
    { "from": "D13", "to": "LED", "type": "OUTPUT" },
    { "from": "D2", "to": "Button", "type": "INPUT_PULLUP" }
  ]
}
```

## Implementation Priority

1. **Phase 1** (Essential): OpenAI API integration with basic rate limiting
2. **Phase 2** (Important): User authentication and quota management
3. **Phase 3** (Enhanced): Caching, advanced monitoring, cost optimization
4. **Phase 4** (Future): Self-hosted LLM option, advanced diagram generation

## Estimated Costs (Monthly)

- **OpenAI GPT-4**: $50-$500/month (depends on usage)
- **OpenAI GPT-3.5-turbo**: $10-$100/month (more cost-effective)
- **Self-hosted LLM**: $500-$2000/month (infrastructure costs)

## Required Dependencies

Add to `server/package.json`:

```json
{
  "dependencies": {
    "openai": "^4.0.0",
    "express-rate-limit": "^7.1.0",
    "winston": "^3.11.0",
    "node-cache": "^5.1.2",
    "dotenv": "^16.3.1"
  }
}
```

## Contact for Implementation

For questions or assistance with production AI backend setup, please consult with:
- Your DevOps team for infrastructure setup
- Security team for API key management review
- Product team for feature prioritization and budget approval

---

**Last Updated**: 2026-01-22  
**Status**: Ready for Production Integration
