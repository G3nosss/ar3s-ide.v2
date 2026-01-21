# AR3S IDE v.2

Web-based IDE for Arduino firmware development and remote device flashing.

## Purpose

AR3S IDE v.2 is a cloud-based development environment for writing, compiling, and flashing Arduino code. The system uses Docker-containerized `arduino-cli` to compile AVR firmware and provides a browser-based interface for device programming.

## Deployment

**Status:** Deployed  
**Date:** 2026-01-21

The site requires the following components:
- `assets/` - Frontend resources
- `pages/` - Web interface pages
- Backend API (Node.js/Express on port 8081)
- Docker container for Arduino compilation

**Repository:** https://github.com/G3nosss/ar3s-ide.v2  
**License:** Proprietary - All Rights Reserved
