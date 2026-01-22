# AR3S IDE v.2 - Server Setup Guide

## Overview

This guide provides instructions for setting up and running the AR3S IDE server, including the Athena AI integration.

## Prerequisites

- Node.js v20.x or higher
- npm v10.x or higher
- Docker (for Arduino compilation)

## Installation

1. **Install Node.js dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Build Arduino CLI Docker container:**
   ```bash
   docker build -f Dockerfile.arduino-cli -t arduino-cli-avr .
   ```

## Running the Server

### Starting the Server

The server runs on **port 8081** by default. To start:

```bash
cd server
node index.cjs
```

The server will start and display:
```
Ar3s AVR build API listening on port 8081
```

### Custom Port Configuration

To run on a different port, set the `PORT` environment variable:

```bash
PORT=3000 node index.cjs
```

### Common Issues

#### Port Already in Use

If you see an error like:
```
Error: listen EADDRINUSE: address already in use :::8081
```

**Solution 1:** Find and stop the process using port 8081:
```bash
# On Linux/Mac:
lsof -i :8081
kill -9 <PID>

# On Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

**Solution 2:** Use a different port:
```bash
PORT=8082 node index.cjs
```

#### Permission Issues with Docker

If Docker commands fail with permission errors:

```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

#### Firmware Directory Not Found

The server requires these directories:
- `/var/www/ar3s/firmware/avr/` - For compiled firmware
- `/tmp/test-sketch/` - For temporary sketch files

These are created automatically, but ensure the server has write permissions.

## API Endpoints

### Build Firmware
- **Endpoint:** `POST /api/build/avr`
- **Body:**
  ```json
  {
    "code": "Arduino code here",
    "fqbn": "arduino:avr:uno"
  }
  ```

### Athena AI Copilot
- **Endpoint:** `POST /api/copilot`
- **Body:**
  ```json
  {
    "userPrompt": "Create a blink program with 2 LEDs",
    "mode": "generate",
    "existingCode": "optional existing code for debug mode"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "firmware_code": "Generated Arduino code",
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

## Development Mode

For development with auto-restart on file changes, use `nodemon`:

```bash
npm install -g nodemon
nodemon index.cjs
```

## Production Deployment

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start index.cjs --name "ar3s-server"

# Enable auto-restart on system boot
pm2 startup
pm2 save

# View logs
pm2 logs ar3s-server

# Stop server
pm2 stop ar3s-server
```

### Using systemd (Linux)

Create `/etc/systemd/system/ar3s-server.service`:

```ini
[Unit]
Description=AR3S IDE Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ar3s/server
ExecStart=/usr/bin/node index.cjs
Restart=on-failure
Environment=PORT=8081

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ar3s-server
sudo systemctl start ar3s-server
sudo systemctl status ar3s-server
```

## Firewall Configuration

If running on a server, ensure port 8081 is accessible:

```bash
# UFW (Ubuntu)
sudo ufw allow 8081/tcp

# firewalld (RHEL/CentOS)
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --reload
```

## Troubleshooting

### Server won't start
1. Check if port is already in use
2. Verify Node.js version: `node --version`
3. Check file permissions
4. Review error logs

### AI endpoints returning errors
1. Verify the request body includes `userPrompt` field
2. Check server logs for detailed error messages
3. Ensure proper JSON formatting in requests

### Build endpoints failing
1. Verify Docker is running: `docker ps`
2. Check if arduino-cli-avr image exists: `docker images`
3. Ensure sketch directories have write permissions

## Support

For issues or questions:
- GitHub: https://github.com/G3nosss/ar3s-ide.v2
- Check server logs for detailed error information
