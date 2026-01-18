# AR3S IDE v.2

![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge&logo=semver)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge&logo=activity)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## ⚡ Overview

**AR3S IDE v.2** is a cloud-native, web-based Integrated Development Environment (IDE) designed for seamless remote coding and hardware management. Beyond standard editing capabilities, it features a dedicated **Firmware Flasher**, allowing users to write, compile, and flash code to remote devices directly from the browser.

Engineered for performance and security, the system is architected to run on **AWS**, utilizing **Caddy** as a reverse proxy to ensure secure, automated HTTPS connections (Port 443) between the client and the backend services.

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | Core server logic (`server.js`) handling API requests and file operations. |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Responsive, client-side interface for the editor and flasher. |
| **Proxy** | ![Caddy](https://img.shields.io/badge/Caddy-00ADD8?style=flat-square&logo=caddy&logoColor=white) | Reverse proxy for automatic HTTPS termination and traffic routing. |
| **Infrastructure** | ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white) | Cloud hosting environment (EC2). |

## 🚀 Key Features

* **Remote Firmware Flashing:** Direct interface to flash binaries to connected microcontrollers.
* **Secure Connection:** Fully configured Caddy reverse proxy ensuring encrypted traffic (HTTPS).
* **Cloud-Based Workflow:** Edit and deploy from any device with a browser.
* **Integrated Terminal:** (Optional: If applicable) Direct command execution on the host server.

## ⚙️ Installation & Deployment

### Prerequisites
* Node.js (v18+ recommended)
* npm or yarn
* Caddy Server installed on the host

### 1. Clone the Repository
```bash
git clone [https://github.com/G3nosss/ar3s-ide.v2.git](https://github.com/G3nosss/ar3s-ide.v2.git)
cd ar3s-ide.v2
