# AR3S IDE v.2

Web-based IDE for Arduino firmware development and remote device flashing with integrated **Athena AI Assistant**.

## Purpose

AR3S IDE v.2 is a cloud-based development environment for writing, compiling, and flashing Arduino code. The system uses Docker-containerized `arduino-cli` to compile AVR firmware and provides a browser-based interface for device programming.

### ✨ Athena AI Assistant

Athena AI is an intelligent coding assistant integrated directly into the AR3S IDE. It provides:

- **Code Generation**: Generate Arduino code from natural language prompts
- **Code Debugging**: Get intelligent suggestions to fix and improve your code
- **Pinout Diagrams**: Create hardware configuration and wiring diagrams
- **IDE Integration**: Seamlessly insert generated code into the editor

## Features

- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Multi-Board Support**: Arduino Uno, Nano, Mega 2560, and custom boards
- **Real-time Compilation**: Build AVR firmware using Docker-containerized arduino-cli
- **Device Flashing**: Upload firmware directly to Arduino devices via WebSerial
- **AI-Powered Assistance**: Integrated Athena AI for code generation and debugging
- **Simulator Integration**: Test circuits virtually with Wokwi
- **ESP/STM Flashers**: Direct firmware flashing for ESP32/ESP8266 and STM32 devices

## Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Docker** (for Arduino compilation)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/G3nosss/ar3s-ide.v2.git
   cd ar3s-ide.v2
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Build the Docker image for Arduino compilation:**
   ```bash
   cd ..
   docker build -f Dockerfile.arduino-cli -t arduino-cli-avr .
   ```

4. **Create required directories:**
   ```bash
   sudo mkdir -p /var/www/ar3s/firmware/avr
   sudo mkdir -p /tmp/test-sketch
   sudo chown -R $USER:$USER /var/www/ar3s /tmp/test-sketch
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   node index.cjs
   ```
   
   The server will start on `http://localhost:8081`

2. **Access the IDE:**
   
   Open your browser and navigate to:
   - **Homepage**: http://localhost:8081/index.html
   - **IDE**: http://localhost:8081/pages/ide.html
   - **Simulator**: http://localhost:8081/pages/simulator.html

### Using Athena AI

1. **Open the IDE** at http://localhost:8081/pages/ide.html
2. **Click the "⚡ Athena AI" button** in the toolbar
3. **Choose a mode:**
   - **Generate Code**: Create new Arduino code from a description
   - **Debug Code**: Get help debugging existing code
4. **Enter your prompt** (e.g., "Create a blink program with 2 LEDs on pins 12 and 13")
5. **Click "Generate with AI"** to get your code
6. **Use "Put in IDE"** to insert the generated code into the editor
7. **Use "Generate Pinout Diagram"** to create hardware wiring diagrams

## Project Structure

```
ar3s-ide.v2/
├── assets/              # Frontend resources
│   ├── athena-ai.js     # Athena AI integration
│   ├── ide.js           # IDE functionality
│   ├── styles.css       # IDE styling
│   └── homepage.css     # Homepage styling
├── pages/               # Web interface pages
│   ├── ide.html         # Main IDE page
│   ├── simulator.html   # Circuit simulator
│   └── ...              # Other pages
├── server/              # Backend API
│   ├── index.cjs        # Express server with /api/copilot endpoint
│   └── package.json     # Server dependencies
├── firmware/            # Compiled firmware storage
├── docs/                # Documentation
├── index.html           # Homepage
└── Dockerfile.arduino-cli  # Arduino compilation container
```

## API Endpoints

### POST /api/build/avr
Compiles Arduino code into a .hex firmware file.

**Request:**
```json
{
  "code": "Arduino sketch code",
  "fqbn": "arduino:avr:uno"
}
```

**Response:**
```json
{
  "artifactUrl": "/firmware/avr/sketch.ino.hex",
  "log": "Compilation output"
}
```

### POST /api/copilot
Athena AI endpoint for code generation and assistance.

**Request:**
```json
{
  "prompt": "Create a blink program",
  "mode": "generate",
  "existingCode": ""
}
```

**Response:**
```json
{
  "success": true,
  "code": "Generated Arduino code",
  "mode": "generate"
}
```

**Modes:**
- `generate`: Generate new code from a prompt
- `debug`: Debug and improve existing code
- `pinout`: Generate pinout diagrams and hardware configurations

## Development

### Testing the AI Integration

```bash
# Test the copilot endpoint
curl -X POST http://localhost:8081/api/copilot \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a simple LED blink program",
    "mode": "generate"
  }'
```

### Building for Production

For production deployment:

1. Ensure Docker is properly configured
2. Set up proper file permissions for `/var/www/ar3s`
3. Configure a reverse proxy (nginx/Caddy) for HTTPS
4. Set up systemd service for auto-start (see `docs/setup-instructions.txt`)

## Deployment

**Status:** Deployed  
**Date:** 2026-01-21

The site requires the following components:
- `assets/` - Frontend resources
- `pages/` - Web interface pages
- Backend API (Node.js/Express on port 8081)
- Docker container for Arduino compilation

## Troubleshooting

### Port 8081 already in use
```bash
# Find and kill the process using port 8081
lsof -ti:8081 | xargs kill -9
```

### Docker container not found
```bash
# Rebuild the Docker image
docker build -f Dockerfile.arduino-cli -t arduino-cli-avr .
```

### Monaco editor not loading
The IDE uses Monaco Editor from CDN. Ensure you have internet connectivity for the editor to load properly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

**AGPL-3.0**

**Repository:** https://github.com/G3nosss/ar3s-ide.v2
