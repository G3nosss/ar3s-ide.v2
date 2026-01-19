# AR3S IDE v.2

![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge&logo=semver)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge&logo=activity)
![License](https://img.shields.io/badge/license-AGPL_v3-red?style=for-the-badge)

## 📄 License

This project is protected under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

This ensures that the software remains open and free. Unlike permissive licenses, the AGPL-3.0 requires that:
1.  **Source Code Disclosure:** If you modify this software and distribute it (or host it as a service over a network), you must make your source code available to users.
2.  **Same License:** Derivatives must be released under the same AGPL-3.0 license.

See `LICENSE` for the full legal text.

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#️-tech-stack)
- [Key Features](#-key-features)
- [Backend API](#-backend-api)
- [Architecture](#-architecture)
- [Installation & Deployment](#️-installation--deployment)
- [Testing](#-testing)
- [Maintenance](#-maintenance)
- [Documentation](#-documentation)

## ⚡ Overview

**AR3S IDE v.2** is a cloud-native, web-based Integrated Development Environment (IDE) designed for seamless remote coding and hardware management. Beyond standard editing capabilities, it features a dedicated **Firmware Flasher**, allowing users to write, compile, and flash code to remote devices directly from the browser.

Engineered for performance and security, the system is architected to run on **AWS**, utilizing **Caddy** as a reverse proxy to ensure secure, automated HTTPS connections (Port 443) between the client and the backend services.

The system leverages a powerful **Ar3s AVR Build API** backend service that compiles Arduino sketches in real-time using `arduino-cli` within isolated Docker containers, generating ready-to-flash `.hex` firmware files.

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | Core server logic (Node.js + Express) handling API requests and file operations. |
| **Build System** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Arduino](https://img.shields.io/badge/Arduino-00979D?style=flat-square&logo=arduino&logoColor=white) | Docker-containerized `arduino-cli` for AVR firmware compilation. |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Responsive, client-side interface for the editor and flasher. |
| **Proxy** | ![Caddy](https://img.shields.io/badge/Caddy-00ADD8?style=flat-square&logo=caddy&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white) | Reverse proxy for automatic HTTPS termination and traffic routing. |
| **Infrastructure** | ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white) | Cloud hosting environment (EC2). |

## 🚀 Key Features

* **Real-time Arduino Sketch Compilation:** Write code in the browser and compile it instantly to `.hex` firmware files.
* **Docker-based Build Environment:** Isolated, containerized build system using `arduino-cli` for consistent compilation.
* **Automated Firmware Generation:** Generates `.hex` files with bootloader, ready for direct upload to AVR microcontrollers.
* **RESTful API Architecture:** Clean, well-documented API endpoints for programmatic access to compilation services.
* **Remote Firmware Flashing:** Direct interface to flash binaries to connected microcontrollers.
* **Secure Connection:** Fully configured Caddy/Nginx reverse proxy ensuring encrypted traffic (HTTPS).
* **Cloud-Based Workflow:** Edit and deploy from any device with a browser.
* **Multi-Board Support:** Compatible with Arduino Uno, Nano, Mega, Leonardo, and other AVR boards.

## 🔌 Backend API

The **Ar3s AVR Build API** is a Node.js/Express web service that powers the IDE's compilation capabilities. It runs on **port 8081** and provides RESTful endpoints for building AVR firmware using `arduino-cli` within a Docker container.

### Overview

- **Service Port:** 8081
- **Technology:** Node.js + Express
- **Build Tool:** arduino-cli (Docker-containerized)
- **Output:** `.hex` firmware files with bootloader

### API Endpoints

#### `POST /api/build/avr`

Compiles Arduino sketches into AVR firmware files.

**Request:**

```bash
POST http://localhost:8081/api/build/avr
Content-Type: application/json

{
  "code": "void setup() { pinMode(LED_BUILTIN, OUTPUT); } void loop() { digitalWrite(LED_BUILTIN, HIGH); delay(1000); digitalWrite(LED_BUILTIN, LOW); delay(1000); }",
  "fqbn": "arduino:avr:uno"
}
```

**Response (Success - 200 OK):**

```json
{
  "artifactUrl": "/firmware/avr/sketch.ino.with_bootloader.hex",
  "log": "Sketch uses 924 bytes (2%) of program storage space...\nBuild completed successfully."
}
```

**Response (Error - 400 Bad Request):**

```json
{
  "error": "Missing 'code' or 'fqbn' in request body"
}
```

**Response (Error - 500 Internal Server Error):**

```json
{
  "error": "Compilation failed",
  "log": "exit status 1\nError compiling for board Arduino Uno."
}
```

### Supported Board FQBNs

| Board | FQBN |
|-------|------|
| Arduino Uno | `arduino:avr:uno` |
| Arduino Nano | `arduino:avr:nano` |
| Arduino Mega 2560 | `arduino:avr:mega` |
| Arduino Leonardo | `arduino:avr:leonardo` |
| Arduino Micro | `arduino:avr:micro` |
| Arduino Pro/Pro Mini | `arduino:avr:pro` |

### Example cURL Commands

**Basic Blink Sketch:**

```bash
curl -X POST http://localhost:8081/api/build/avr \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "void setup() { pinMode(LED_BUILTIN, OUTPUT); } void loop() { digitalWrite(LED_BUILTIN, HIGH); delay(1000); digitalWrite(LED_BUILTIN, LOW); delay(1000); }",
    "fqbn": "arduino:avr:uno"
  }'
```

**Serial Communication:**

```bash
curl -X POST http://localhost:8081/api/build/avr \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "void setup() { Serial.begin(115200); } void loop() { Serial.println(\"Hello World\"); delay(1000); }",
    "fqbn": "arduino:avr:uno"
  }'
```

## 🏗️ Architecture

### Directory Structure

```
/opt/ar3s-server/
├── server/
│   └── index.js              # Main API server file
└── docs/
    └── setup-instructions.txt # Detailed setup guide

/var/www/ar3s/
├── firmware/
│   └── avr/                  # Generated .hex files stored here
│       └── sketch.ino.with_bootloader.hex
└── (web frontend files)

/tmp/
└── test-sketch*/             # Temporary Arduino sketch directories
    └── test-sketch.ino

/etc/systemd/system/
└── ar3s-build-api.service    # SystemD service configuration
```

### Service Components

1. **Frontend (Browser)** → User writes code in the web IDE
2. **HTTPS Proxy (Caddy/Nginx)** → Handles SSL/TLS termination (Port 443)
3. **Backend API (Node.js)** → Receives build requests (Port 8081)
4. **Docker Container** → Executes `arduino-cli` compilation
5. **Firmware Storage** → Serves generated `.hex` files

### Communication Flow

```
Browser (HTTPS) → Caddy/Nginx Proxy → Node.js API (Port 8081)
                                           ↓
                                    Docker Container
                                    (arduino-cli)
                                           ↓
                                    .hex Firmware File
                                           ↓
                                    /var/www/ar3s/firmware/avr/
```

## ⚙️ Installation & Deployment

### Prerequisites

* **Node.js** (v18+ recommended)
* **npm** or **yarn**
* **Docker** (for arduino-cli container)
* **Caddy** or **Nginx** (reverse proxy)
* **Git** (for cloning the repository)
* **Linux server** (Ubuntu 20.04+ or similar)

### 1. Clone the Repository

```bash
git clone https://github.com/G3nosss/ar3s-ide.v2.git
cd ar3s-ide.v2
```

### 2. Backend Service Installation

#### Create Server Directory

```bash
sudo mkdir -p /opt/ar3s-server/server
sudo mkdir -p /var/www/ar3s/firmware/avr
```

#### Install Node.js Dependencies

```bash
cd /opt/ar3s-server/server
npm install express cors
```

#### Deploy Backend Code

Copy your `index.js` server file to `/opt/ar3s-server/server/`.

### 3. Docker Container Setup

#### Install Docker

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

#### Create Arduino CLI Docker Container

```bash
# Pull the Arduino CLI Docker image
docker pull arduino/arduino-cli:latest

# Create a persistent container
docker run -d --name arduino-builder \
  -v /tmp:/tmp \
  -v /var/www/ar3s/firmware:/firmware \
  arduino/arduino-cli:latest \
  tail -f /dev/null

# Install AVR core
docker exec arduino-builder arduino-cli core update-index
docker exec arduino-builder arduino-cli core install arduino:avr
```

### 4. SystemD Service Configuration

#### Create Service File

Create `/etc/systemd/system/ar3s-build-api.service`:

```ini
[Unit]
Description=Ar3s AVR Build API Service
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/ar3s-server/server
ExecStart=/usr/bin/node /opt/ar3s-server/server/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Environment variables (optional)
Environment="NODE_ENV=production"
Environment="PORT=8081"

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable ar3s-build-api
sudo systemctl start ar3s-build-api
sudo systemctl status ar3s-build-api
```

### 5. Reverse Proxy Configuration

#### Option A: Caddy Configuration

Create `/etc/caddy/Caddyfile`:

```caddy
ar3s-compiler.duckdns.org {
    # Frontend files
    root * /var/www/ar3s
    file_server

    # API proxy
    handle /api/* {
        reverse_proxy localhost:8081
    }

    # Firmware files
    handle /firmware/* {
        file_server
    }

    # TLS configuration (automatic with Caddy)
    tls your-email@example.com
}
```

Restart Caddy:

```bash
sudo systemctl restart caddy
```

#### Option B: Nginx Configuration

Create `/etc/nginx/sites-available/ar3s-ide`:

```nginx
server {
    listen 80;
    server_name ar3s-compiler.duckdns.org;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ar3s-compiler.duckdns.org;
    
    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/ar3s-compiler.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ar3s-compiler.duckdns.org/privkey.pem;
    
    # Frontend files
    root /var/www/ar3s;
    index index.html;
    
    # Frontend files
    location / {
        try_files $uri $uri/ =404;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Firmware files
    location /firmware/ {
        alias /var/www/ar3s/firmware/;
        autoindex off;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/ar3s-ide /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL/TLS Certificate Setup

#### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# For Nginx
sudo certbot --nginx -d ar3s-compiler.duckdns.org

# For standalone (if using Caddy, it handles this automatically)
sudo certbot certonly --standalone -d ar3s-compiler.duckdns.org
```

#### Auto-renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job, but verify:
sudo systemctl status certbot.timer
```

### 7. Set Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /opt/ar3s-server/
sudo chown -R www-data:www-data /var/www/ar3s/

# Set permissions
sudo chmod -R 755 /var/www/ar3s/
sudo chmod -R 755 /opt/ar3s-server/
```

### 8. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Optionally allow port 8081 for direct API access (not recommended for production)
# sudo ufw allow 8081/tcp

sudo ufw reload
```

## 🧪 Testing

### Verify Service Status

```bash
# Check if the API service is running
sudo systemctl status ar3s-build-api

# Check if the API is listening on port 8081
sudo netstat -tulpn | grep 8081

# View service logs
sudo journalctl -u ar3s-build-api -f
```

### Test API with cURL

#### Test 1: Simple Blink Sketch

```bash
curl -i -X POST http://localhost:8081/api/build/avr \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "void setup() { pinMode(LED_BUILTIN, OUTPUT); } void loop() { digitalWrite(LED_BUILTIN, HIGH); delay(1000); digitalWrite(LED_BUILTIN, LOW); delay(1000); }",
    "fqbn": "arduino:avr:uno"
  }'
```

**Expected Output:**
- HTTP Status: `200 OK`
- Response includes `artifactUrl` field
- Response includes compilation `log`

#### Test 2: Serial Communication

```bash
curl -i -X POST http://localhost:8081/api/build/avr \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "void setup() { Serial.begin(115200); Serial.println(\"Starting...\"); } void loop() { Serial.println(\"Hello World\"); delay(1000); }",
    "fqbn": "arduino:avr:uno"
  }'
```

#### Test 3: Arduino Mega Board

```bash
curl -i -X POST http://localhost:8081/api/build/avr \
  -H 'Content-Type: application/json' \
  -d '{
    "code": "void setup() { pinMode(13, OUTPUT); } void loop() { digitalWrite(13, HIGH); delay(500); digitalWrite(13, LOW); delay(500); }",
    "fqbn": "arduino:avr:mega"
  }'
```

### Verify Generated Firmware

```bash
# List generated firmware files
ls -lh /var/www/ar3s/firmware/avr/

# Check file size (should be a few KB)
du -h /var/www/ar3s/firmware/avr/*.hex

# Verify hex file format
head -n 5 /var/www/ar3s/firmware/avr/sketch.ino.with_bootloader.hex
```

Expected output should start with `:` (Intel HEX format):
```
:100000000C945D000C9485000C9485000C94850084
:100010000C9485000C9485000C9485000C9485004C
...
```

### Test Through Web Interface

1. Navigate to `https://ar3s-compiler.duckdns.org` in your browser
2. Write a simple Arduino sketch in the editor
3. Click the "Build" button
4. Verify compilation logs appear
5. Check that the download link for `.hex` file is generated

## 🔧 Maintenance

### Service Management

#### Start/Stop/Restart Service

```bash
# Start the service
sudo systemctl start ar3s-build-api

# Stop the service
sudo systemctl stop ar3s-build-api

# Restart the service
sudo systemctl restart ar3s-build-api

# Enable service on boot
sudo systemctl enable ar3s-build-api

# Disable service from boot
sudo systemctl disable ar3s-build-api

# Check service status
sudo systemctl status ar3s-build-api
```

#### View Service Logs

```bash
# View all logs
sudo journalctl -u ar3s-build-api

# Follow logs in real-time
sudo journalctl -u ar3s-build-api -f

# View logs from last hour
sudo journalctl -u ar3s-build-api --since "1 hour ago"

# View logs from today
sudo journalctl -u ar3s-build-api --since today

# View error logs only
sudo journalctl -u ar3s-build-api -p err
```

### Log Management and Rotation

#### Configure Journal Log Limits

Edit `/etc/systemd/journald.conf`:

```ini
[Journal]
SystemMaxUse=500M
SystemMaxFileSize=100M
RuntimeMaxUse=100M
```

Apply changes:

```bash
sudo systemctl restart systemd-journald
```

#### Manual Log Cleanup

```bash
# Remove logs older than 7 days
sudo journalctl --vacuum-time=7d

# Keep only 500MB of logs
sudo journalctl --vacuum-size=500M
```

### File Cleanup

#### Clean Temporary Sketch Files

```bash
# Remove old sketch directories (older than 7 days)
find /tmp/test-sketch* -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

# Remove old firmware files (older than 30 days)
find /var/www/ar3s/firmware/avr/ -type f -name "*.hex" -mtime +30 -delete
```

#### Automated Cleanup with Cron

Add to crontab (`sudo crontab -e`):

```bash
# Clean temporary sketches daily at 2 AM
0 2 * * * find /tmp/test-sketch* -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

# Clean old firmware files weekly on Sunday at 3 AM
0 3 * * 0 find /var/www/ar3s/firmware/avr/ -type f -name "*.hex" -mtime +30 -delete 2>/dev/null
```

### Backup and Restore

#### Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/backup/ar3s-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup server code
tar -czf "$BACKUP_DIR/server.tar.gz" /opt/ar3s-server/

# Backup firmware files
tar -czf "$BACKUP_DIR/firmware.tar.gz" /var/www/ar3s/firmware/

# Backup service configuration
cp /etc/systemd/system/ar3s-build-api.service "$BACKUP_DIR/"

# Backup Caddy/Nginx configuration
cp /etc/caddy/Caddyfile "$BACKUP_DIR/" 2>/dev/null || true
cp -r /etc/nginx/sites-available/ar3s-ide "$BACKUP_DIR/" 2>/dev/null || true

echo "Backup completed: $BACKUP_DIR"
```

#### Restore Procedure

```bash
# Stop the service
sudo systemctl stop ar3s-build-api

# Restore server code
sudo tar -xzf /backup/ar3s-YYYYMMDD/server.tar.gz -C /

# Restore firmware files
sudo tar -xzf /backup/ar3s-YYYYMMDD/firmware.tar.gz -C /

# Restore service configuration
sudo cp /backup/ar3s-YYYYMMDD/ar3s-build-api.service /etc/systemd/system/

# Reload systemd and restart service
sudo systemctl daemon-reload
sudo systemctl start ar3s-build-api
```

### Troubleshooting Common Issues

#### Issue 1: Service Fails to Start

**Symptoms:**
- `systemctl status ar3s-build-api` shows "failed" or "inactive"

**Solutions:**

```bash
# Check logs for errors
sudo journalctl -u ar3s-build-api -n 50

# Verify Node.js is installed
node --version

# Check if port 8081 is already in use
sudo lsof -i :8081

# Verify working directory exists
ls -la /opt/ar3s-server/server/

# Check file permissions
sudo chown -R www-data:www-data /opt/ar3s-server/
```

#### Issue 2: Docker Container Not Available

**Symptoms:**
- Build requests fail with Docker-related errors

**Solutions:**

```bash
# Check if Docker is running
sudo systemctl status docker

# Start Docker if stopped
sudo systemctl start docker

# Verify Docker container exists
docker ps -a | grep arduino

# Restart the container
docker restart arduino-builder

# Recreate container if needed
docker rm arduino-builder
docker run -d --name arduino-builder \
  -v /tmp:/tmp \
  -v /var/www/ar3s/firmware:/firmware \
  arduino/arduino-cli:latest \
  tail -f /dev/null
```

#### Issue 3: Compilation Errors

**Symptoms:**
- API returns 500 error with compilation failure

**Solutions:**

```bash
# Verify arduino-cli is installed
docker exec arduino-builder arduino-cli version

# Check installed cores
docker exec arduino-builder arduino-cli core list

# Reinstall AVR core
docker exec arduino-builder arduino-cli core update-index
docker exec arduino-builder arduino-cli core install arduino:avr
```

#### Issue 4: Firmware Files Not Generated

**Symptoms:**
- Build succeeds but no `.hex` file in `/var/www/ar3s/firmware/avr/`

**Solutions:**

```bash
# Check directory permissions
ls -la /var/www/ar3s/firmware/

# Create directory if missing
sudo mkdir -p /var/www/ar3s/firmware/avr

# Set correct ownership
sudo chown -R www-data:www-data /var/www/ar3s/firmware/

# Check Docker volume mounts
docker inspect arduino-builder | grep Mounts -A 10
```

#### Issue 5: SSL Certificate Errors

**Symptoms:**
- Browser shows SSL warnings
- Certificate expired

**Solutions:**

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test auto-renewal
sudo certbot renew --dry-run

# Restart web server
sudo systemctl restart caddy  # or nginx
```

#### Issue 6: High Disk Usage

**Symptoms:**
- Server runs out of disk space
- Build failures due to insufficient space

**Solutions:**

```bash
# Check disk usage
df -h

# Clean temporary files immediately
find /tmp/test-sketch* -type d -exec rm -rf {} + 2>/dev/null

# Remove old firmware files
find /var/www/ar3s/firmware/avr/ -type f -name "*.hex" -mtime +7 -delete

# Check Docker disk usage
docker system df

# Clean Docker resources
docker system prune -a
```

### Monitoring and Health Checks

#### System Health Check Script

```bash
#!/bin/bash
echo "=== Ar3s Build API Health Check ==="
echo ""

# Check service status
echo "Service Status:"
systemctl is-active ar3s-build-api

# Check port
echo -e "\nPort 8081 Status:"
netstat -tulpn | grep 8081 || echo "Port not listening"

# Check Docker
echo -e "\nDocker Status:"
systemctl is-active docker

# Check disk space
echo -e "\nDisk Usage:"
df -h / | tail -1

# Check recent errors
echo -e "\nRecent Errors:"
journalctl -u ar3s-build-api -p err --since "1 hour ago" --no-pager | tail -5

echo ""
echo "=== Health Check Complete ==="
```

## 📚 Documentation

For detailed setup instructions, configuration examples, and advanced topics, see:

- **[Setup Instructions](/docs/setup-instructions.txt)** - Complete deployment guide with all configuration details
- **[API Documentation](#-backend-api)** - Full API reference (above)
- **[Architecture Overview](#-architecture)** - System design and components (above)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, bugs, or feature requests, please open an issue on the [GitHub repository](https://github.com/G3nosss/ar3s-ide.v2/issues).

---

**Project Repository:** https://github.com/G3nosss/ar3s-ide.v2

*Last Updated: 2026-01-19*  
*Version: 2.0.0*
