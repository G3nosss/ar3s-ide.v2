sudo apt update
sudo apt install -y nginx git
sudo mkdir -p /var/www/ar3s
sudo git clone https://github.com/G3nosss/ar3s-ide.v2.git /var/www/ar3s
sudo chown -R www-data:www-data /var/www/ar3s
sudo chmod -R 755 /var/www/ar3s
sudo cp /var/www/ar3s/ar3s.conf /etc/nginx/sites-available/ar3s.conf
ls
ls /var/www/ar3s
sudo cp /var/www/ar3s/ar3s-conf /etc/nginx/sites-available/ar3s-conf
sudo cp /var/www/ar3s/ar3s-conf /etc/nginx/sites-available/ar3s.conf
sudo ln -s /etc/nginx/sites-available/ar3s.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx
sudo apt install -y certbot
python3-certbot-nginx
sudo certbot --nginx -d
ar3s-compiler.duckdns.org
sudo certbot --nginx -d ar3s-compiler.duckdns.org
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ar3s-compiler.duckdns.org
sudo git -C /var/www/ar3s pull origin main
git checkout main
.git
git checkout main
cd ar3s-ide.v2
cd /var/www/ar3s
git checkout main
git config --global --add safe.directory /var/www/ar3s
git checkout main
cd /var/www/ar3s
git checkout main
git config --global --add safe.directory /var/www/ar3s
git checkout main
sudo chown -R ubuntu:ubuntu /var/www/ar3s
git checkout main
git pull origin main
git reset --hard HEAD
git pull origin main
cd /var/www/ar3s
sudo git -C /var/www/ar3s pull origin main
sudo systemctl reload nginx
sudo grep -n 'buildAvrBtn' /var/www/ar3s/pages/ide.html
cd ar3s-ide.v2
cd /var/www/ar3s
cd ar3s-ide.v2
git checkout -b feature/frontend-avr-esp-custom
git add .
git commit -m "Frontend: Avr build button + log; ESP Custom Flasher; nav updates; minor CSS"
git add .
git commit -m "Frontend: Avr build button + log; ESP Custom Flasher; nav updates; minor CSS"
sudo apt-get update && sudo apt-get install -y nginx docker.io nodejs npm
sudo mkdir -p /opt/ar3s-server/server
sudo mkdir -p /var/www/ar3s/firmware/avr
sudo chown -R www-data:www-data /var/www/ar3s/firmware || true
sudo nano /opt/ar3s-server/Dockerfile.arduino-cli
sudo nano /opt/ar3s-server/server/index.js
cd /opt/ar3s-server && sudo docker build -t arduino-cli-avr -f Dockerfile.arduino-cli .
ln -sf /etc/nginx/sites-available/ar3s.conf /etc/nginx/sites-enabled/ar3s.conf
-sf /etc/nginx/sites-available/ar3s.conf /etc/nginx/sites-enabled/ar3s.conf
sudo nano /etc/systemd/system/ar3s-avr.service
suno nano /opt/ar3s-server/Dockerfile.arduino-cli
sudo nano /opt/ar3s-server/Dockerfile.arduino-cli
sudo mkdir -p cd /opt/ar3s-server && npm init -y && npm i express
sudo chown -R www-data:www-data /var/www/ar3s/firmware || true
sudo systemctl daemon-reload
sudo systemctl enable --now ar3s-avr.service
sudo ln -sf /etc/nginx/sites-available/ar3s.conf /etc/nginx/sites-enabled/ar3s.conf
sudo nano /etc/nginx/sites-available/ar3s.conf
sudo nano /etc/systemd/system/ar3s-avr.service
sudo systemctl daemon-reload
sudo systemctl enable --now ar3s-avr.service
sudo ln -sf /etc/nginx/sites-available/ar3s.conf /etc/nginx/sites-enabled/ar3s.conf
sudo nginx -t && sudo systemctl reload nginx
ssh ubuntu@ar3s-compiler.duckdns.org
sudo systemctl status nginx
sudo nginx -t
sudo ss -tulpen | grep nginx
nslookup ar3s-compiler.duckdns.org
ufw status
ufw allow 80/tcp
ls -la /var/www/ar3s/
sudo certbot certificates
curl -I http://localhost
curl -I http://ar3s-compiler.duckdns.org
sudo systemctl status ar3s-avr.service
sudo journalctl -xeu ar3s-avr.service
git checkout -b feature/frontend-avr-esp-custom
cd /var/www/ar3s
git checkout -b feature/frontend-avr-esp-custom
git add .
git commit -m "Frontend: AVR build button + log; ESP Custom Flasher; nav updates; minor CSS"
git push origin feature/frontend-avr-esp-custom
git auth token
git -auth token
gh auth login
git push origin feature/frontend-avr-esp-custom
pkg update
pkg install gh
apt update
apt install gh
git credential-catch exit
credential-cache
credential-cache exit
git cconfig --global --unset credential.helper
git config --global --unset credential.helper
git push origin feature/frontend-avr-esp-custom
sudo systemctl status nginx
sudo nginx -t
sudo ss -tulpn | grep nginx
sudo nano /etc/nginx/sites-enabled/ar3s.conf
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo nano /etc/nginx/sites-enabled/ar3s.conf
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d ar3s-compiler. duckdns.org
sudo certbot --nginx -d ar3s-compiler.duckdns.org
sudo ss -tulpn | grep : 443
sudo ss -tulpn | grep : 22
sudo ss -tulpn | grep :443
cat /etc/nginx/sites-available/ar3s.conf
sudo certbot renew --dry-run
curl -I https://ar3s-compiler.duckdns.org
sudo systemctl status ar3s-avr.service
sudo systemctl start ar3s-avr.service
sudo systemctl enable ar3s-avr.service
sudo journalctl -u ar3s-avr.service -n 50 --no-pager
cd /opt/ar3s-server
nano package.json
sudo chown -R $USER:$USER /opt/ar3s-server
nano package.json
npm install
ls node_modules/ | grep express
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
sudo ss -tulpn | grep 8081
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}","fqbn":"arduino:avr:uno"}'
cd /opt/ar3s-server
nano server/index.js
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr. service
sudo systemctl status ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}","fqbn":"arduino:avr: uno"}'
cd /var/www/ar3s
sudo git pull origin main
sudo chown -R www-data:www-data /var/www/ar3s
ls -lh /var/www/ar3s/pages/esp-custom.html
ls -lh /var/www/ar3s/assets/build-avr.js
ls -lh /var/www/ar3s/assets/esp-custom.js
grep -n "buildAvrBtn" /var/www/ar3s/pages/ide.html
sudo apt-get update
sudo apt-get install -y nginx docker.io nodejs npm
sudo systemctl enable --now docker
sudo mkdir -p /opt/ar3s-server/server
cd /opt/ar3s-server
sudo nano Dockerfile.arduino-cli
cd /opt/ar3s-server
sudo docker build -t arduino-cli-avr -f Dockerfile.arduino-cli .
sudo nano server/index.js
sudo npm init -y
sudo nano i express
sudo mkdir -p /var/www/ar3s/firmware/avr
sudo chown -R www-data:www-data /var/www/ar3s/firmware
sudo nano /etc/nginx/sites-available/ar3s. conf
sudo nano /etc/nginx/sites-available/ar3s.conf
sudo ln -sf /etc/nginx/sites-available/ar3s.conf /etc/nginx/sites-enabled/ar3s.conf
sudo nginx -t
sudo systemctl reload nginx
sudo nano /etc/systemd/system/ar3s-avr.service
sudo systemctl daemon-reload
sudo systemctl enable --now ar3s-avr. service
sudo systemctl enable --now ar3s-avr.service
sudo systemctl status ar3s-avr.service
sudo journalctl -u ar3s-avr.service -f
curl -i -X POST https://ar3s-compiler.duckdns. org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}", "fqbn":"arduino:avr:uno"}'
curl -i -X POST https://ar3s-compiler.duckdns. org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}", "fqbn":"arduino:avr:uno"}'
curl -i -X POST https://ar3s-compiler.duckdns. org/api/build/avr   -H 'Content-Type: application/json' -d '{"code":"void setup(){} void loop(){}", "fqbn":"arduino:avr:uno"}'
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){} void loop(){}", "fqbn":"arduino:avr:uno"}'
sudo crontab -e
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error. log
sudo journalctl -u ar3s-avr.service -f
sudo systemctl stop ar3s-avr.service
cd /opt/ar3s-server/server
sudo node index.js
nano package.json
sudo nano index.js
sudo node index.js
sudo journalctl -u ar3s-avr.service -f
sudo systemctl start ar3s-avr.service
sudo journalctl -u ar3s-avr.service -f
sudo nginx -t
sudo systemctl reload nginx
curl -i https://ar3s-compiler.duckdns.org/api/build/avr
cd /opt/ar3s-server
# Add "type": "module" to package. json
sudo nano package.json
cd /opt/ar3s-server/server
sudo journalctl -u ar3s-avr.service -f
cd /opt/ar3s-server
cd /opt/ar3s-server/server
cd /opt/ar3s-server
sudo nano package.json
# See why the service failed
sudo journalctl -u ar3s-avr.service -n 50 --no-pager
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
sudo systemctl start ar3s-avr.service
sudo systemctl status ar3s-avr.service
sudo nginx -t` → configuration test successful
sudo systemctl reload nginx` completed

sudo journalctl -u ar3s-avr.service -n 50 --no-pager
sudo journalctl -u ar3s-avr.service -n 50
sudo systemctl restart ar3s-avr.service
curl -X POST . ../api/build/avr
sudo journalctl -u ar3s-avr.service -n 100 --no-pager | grep -A 10 "node\|Error\|Cannot"
cd /opt/ar3s-server
sudo /usr/bin/node server/index.js
cat /opt/ar3s-server/package.json
sudo node /opt/ar3s-server/server/index.js 
cd /opt/ar3s-server/server
sudo mv index.js index.js.broken
sudo nano index.js
cd /opt/ar3s-server
sudo node server/index.js
cat -A /opt/ar3s-server/server/index.js | head -25


cd /opt/ar3s-server/server
# Remove the broken file
sudo rm index.js
# Create clean file with correct syntax
sudo tee index.js > /dev/null << 'EOF'
import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json({ limit: "2mb" }));

const AVR_OUT_DIR = "/var/www/ar3s/firmware/avr";
try { 
  fs.mkdirSync(AVR_OUT_DIR, { recursive: true }); 
} catch (e) {
  console.error("Failed to create artifacts dir:", e);
}

app.post("/api/build/avr", (req, res) => {
  const { code, fqbn = "arduino:avr:uno" } = req.body || {};
  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing code parameter");
  }

  const jobId = randomUUID();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `avr-${jobId}-`));
  const sketchDir = path.join(tmpDir, "sketch");
  const outDir = path.join(tmpDir, "build");
  
  fs.mkdirSync(sketchDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive:  true });
  fs.writeFileSync(path.join(sketchDir, "sketch.ino"), code);

  const cmd = [
    "docker run --rm",
    `-v "${sketchDir}":/work/sketch`,
    `-v "${outDir}":/work/build`,
    "arduino-cli-avr",
    "arduino-cli compile --fqbn " + fqbn + " /work/sketch --output-dir /work/build --warnings all"
  ].join(" ");

  exec(cmd, { maxBuffer:  12 * 1024 * 1024 }, (err, stdout, stderr) => {
    const log = stdout + "\n" + stderr;
    
    try {
      if (err) {
        cleanup(tmpDir);
        return res.status(500).json({ log, error: err.message });
      }
      
      const files = fs.readdirSync(outDir);
      const hex = files.find(f => f.endsWith(".hex"));
      
      if (!hex) {
        cleanup(tmpDir);
        return res.status(500).json({ log, error: "No hex file produced" });
      }
      
      const destHex = path.join(AVR_OUT_DIR, jobId + ".hex");
      fs.copyFileSync(path.join(outDir, hex), destHex);
      cleanup(tmpDir);
      
      return res.json({ 
        artifactUrl:  "/firmware/avr/" + jobId + ".hex", 
        log 
      });
    } catch (e) {
      cleanup(tmpDir);
      return res.status(500).json({ error: e.message });
    }
  });
});

function cleanup(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force:  true });
  } catch (e) {
    console.error("Cleanup failed:", e);
  }
}

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log("Ar3s AVR build API listening on " + port);
});
EOF

cat -A /opt/ar3s-server/server/index.js | head -10
sudo node /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
curl -i -X POST https://ar3s-compiler. duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello\");delay(1000);}"}'
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}"}'
nslookup ar3s-compiler.duckdns.org
sudo nano /etc/nginx/sites-available/ar3s. conf
sudo nano /etc/nginx/sites-available/ar3s.conf
sudo rm ar3s. conf
sudo rv /etc/nginx/sites-available/ar3s. conf
sudo rm /etc/nginx/sites-available/ar3s. conf
sudo rm ar3s.
sudo nginx -t
sudo systemctl reload nginx
sudo nano /etc/nginx/sites-enabled/ar3s.conf
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl daemon-reload nginx
sudo systemctl daemon-reload
sudo systemctl status nginx
ls -la /etc/nginx/sites-available/ | grep "ar3s"
sudo rm "/etc/nginx/sites-available/ar3s-conf"
curl -i http://127.0.0.1:8081/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}"}'
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){} void loop(){}"}'
sudo docker images | grep arduino-cli-avr
cat /opt/ar3s-server/Dockerfile.arduino-cli
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Test\");delay(1000);}"}'
# Test Docker image directly
sudo docker run --rm arduino-cli-avr "arduino-cli version"
sudo nano /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr. service
sudo systemctl status ar3s-avr.service
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Test\");delay(1000);}"}'
//sudo journalctl -u ar3s-avr.service -f
sudo journalctl -u ar3s-avr.service -f
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}"}'
sudo journalctl -u ar3s-avr.service -n 50 --no-pager
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}"}'
sudo journalctl -u ar3s-avr.service -n 50 --no-pager
mkdir -p /tmp/test-avr-sketch /tmp/test-avr-build
echo 'void setup(){} void loop(){}' > /tmp/test-avr-sketch/sketch.ino
sudo docker run --rm   -v /tmp/test-avr-sketch:/work/sketch   -v /tmp/test-avr-build:/work/build   arduino-cli-avr   "arduino-cli compile --fqbn arduino:avr:uno /work/sketch --output-dir /work/build --warnings all"
ls -lh /tmp/test-avr-build/
sudo nano /etc/systemd/system/ar3s-avr.service
sudo systemctl daemon-reload
sudo systemctl restart ar3s-avr.service
sudo mkdir -p /var/www/ar3s/firmware/avr
sudo chmod 755 /var/www/ar3s/firmware/avr
sudo chown -R root:root /var/www/ar3s/firmware
sudo usermod -aG docker $USER
# 1. Full curl response
curl -i -X POST https://ar3s-compiler.duckdns.org/api/build/avr   -H 'Content-Type:  application/json'   -d '{"code":"void setup(){} void loop(){}"}'
sudo journalctl -u ar3s-avr.service -n 30 --no-pager
sudo docker run --rm -v /tmp:/work/sketch arduino-cli-avr "arduino-cli version"
sudo nano /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr.service
sudo docker run --rm   -v /tmp/test-sketch:/work/sketch   -v /tmp/test-build:/work/build   arduino-cli-avr   bash -lc "arduino-cli compile --fqbn arduino:avr:uno /work/sketch --output-dir /work/build"
cd /opt/ar3s-server
sudo nano Dockerfile.arduino-cli
# First rebuild with new ENTRYPOINT
cd /opt/ar3s-server
sudo nano Dockerfile.arduino-cli
# Change ENTRYPOINT to ["arduino-cli"]
sudo docker build -t arduino-cli-avr -f Dockerfile.arduino-cli . 
# Then test: 
sudo docker run --rm   -v /tmp/test-sketch:/work/sketch   -v /tmp/test-build:/work/build   arduino-cli-avr   compile --fqbn arduino:avr:uno /work/sketch --output-dir /work/build
cd /opt/ar3s-server
sudo docker build -t arduino-cli-avr -f Dockerfile.arduino-cli . 
sudo nano /opt/ar3s-server/server/index. js
sudo nano /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
mkdir -p /tmp/test-sketch
echo 'void setup(){} void loop(){}' > /tmp/test-sketch/sketch.ino
sudo systemctl status docker
sudo rm -rf /tmp/test-sketch /tmp/test-build
sudo mkdir -p /tmp/test-sketch /tmp/test-build
echo 'void setup(){} void loop(){}' | sudo tee /tmp/test-sketch/sketch.ino
sudo docker run --rm   -v /tmp/test-sketch:/work/sketch   -v /tmp/test-build:/work/build   arduino-cli-avr   compile --fqbn arduino: avr:uno /work/sketch --output-dir /work/build --warnings all
sudo ls -lh /tmp/test-build/
# Check if the Docker command printed any errors
sudo docker run --rm   -v /tmp/test-sketch:/work/sketch   -v /tmp/test-build:/work/build   arduino-cli-avr   compile --fqbn arduino: avr:uno /work/sketch --output-dir /work/build --warnings all
arduino-cli compile --fqbn <board> --output-dir <dir> <sketch>
sudo docker run --rm   -v /tmp/test-sketch/sketch:/work/sketch   -v /tmp/test-build:/work/build   arduino-cli-avr   compile --fqbn arduino:avr:uno --output-dir /work/build /work/sketch
sudo nano /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr.service
sudo rm -rf /tmp/test-sketch /tmp/test-build
sudo mkdir -p /tmp/test-sketch/sketch /tmp/test-build
echo 'void setup(){} void loop(){}' | sudo tee /tmp/test-sketch/sketch/sketch.ino
sudo docker run --rm   -v /tmp/test-sketch/sketch:/work/sketch   -v /tmp/test-build:/work/build   arduino-cli-avr   compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
sudo ls -lh /tmp/test-build/
curl -i -X POST https://ar3s-compiler. duckdns.org/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Test\");delay(1000);}"}'
curl ifconfig.me
nslookup ar3s-compiler.duckdns.org
# Test via localhost
curl -i -X POST http://127.0.0.1:8081/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Test\");delay(1000);}"}'
# Test through Nginx (still localhost, bypasses DNS)
curl -i -X POST https://127.0.0.1/api/build/avr   -H 'Content-Type: application/json'   -H 'Host: ar3s-compiler. duckdns.org'   -d '{"code":"void setup(){} void loop(){}"}'    --insecure
# Check current command in server code
grep -A 2 "arduino-cli-avr" /opt/ar3s-server/server/index.js | grep compile
sudo systemctl restart ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr   -H 'Content-Type: application/json'   -d '{"code":"void setup(){} void loop(){}"}'
const cmd = `docker run --rm -v ${sketchDir}:/work/sketch -v ${outDir}:/work/build arduino-cli-avr compile --fqbn ${fqbn} --output-dir /work/build --warnings all /work/sketch`;
sudo nano /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr. service
sudo systemctl status ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){} void loop(){}"}'
sudo systemctl restart ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){} void loop(){}"}'
sudo systemctl restart ar3s-avr. service
docker run --rm -v <sketchDir>:/work/sketch -v <outDir>:/work/build arduino-cli-avr compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
fs.writeFileSync(path.join(sketchDir, "sketch.ino"), code);
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch \  # this points to where your Arduino sketch is
-v /tmp/avr-build-dir:/work/build \   # this is where the compiled files are stored
arduino-cli-avr                       # the docker image
compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
sudo systemctl start docker
sudo systemctl enable docker
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/ sudo systemctl enable docker
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl enable docker
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/ sudo systemctl enable docker
cd opt/ar3s-server/server/index.js
cd opt/ar3s-server/server
cd opt/ar3s-server/server/
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/work/build sudo systemctl enable docker
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/work/build arduino-cli-avr compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/work/build arduino-cli-avr compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
ls /opt/
cd /opt/
git clone <repository_url> ar3s-server
cd ar3s-server
cd /opt/
git clone https://github.com/G3nosss/ar3s-ide.v2.git ar3s-server
cd ar3s-server
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/work/build arduino/arduino-cli:latest compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
docker pull arduino/arduino-cli:latest
ls /tmp/avr-sketch-dir
fs.writeFileSync(path.join(sketchDir, "sketch.ino"), code);
node create-sketch.js
sudo chmod 777 /tmp/avr-sketch-dir
cd /opt/ar3s-server
nano writeSketch.js
node --version
node writeSketch.js
ls /tmp/avr-sketch-dir/
ls /opt/ar3s-server/
ls /tmp/avr-sketch-dir/
nano /opt/ar3s-server/package.json
node writeSketch.js
ls /tmp/avr-sketch-dir/
nano /opt/ar3s-server/package.json
ls /tmp/avr-sketch-dir/
nano writeSketch.js
node writeSketch.js
ls /tmp/avr-sketch-dir/
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/work/build arduino/arduino-cli:latest compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
docker pull arduino/arduino-cli:latest
docker pull buildkite/arduino-cli
docker pull arduinoci/ci-arduino
docker run --rm -v /tmp/avr-sketch-dir:/work/sketch -v /tmp/avr-build-dir:/work/build arduinoci/ci-arduino compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
sudo apt update
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
sudo mv bin/arduino-cli /usr/local/bin/
arduino-cli version
arduino-cli config init
arduino-cli core update-index
arduino-cli core install arduino:avr
arduino-cli compile --fqbn arduino:avr:uno --output-dir /tmp/avr-build-dir /tmp/avr-sketch-dir/sketch.ino
ls /tmp/avr-sketch-dir/
arduino-cli compile --fqbn arduino:avr:uno --output-dir /tmp/avr-build-dir /tmp/avr-sketch-dir/sketch.ino
sudo chmod -R 777 /tmp/avr-sketch-dir
arduino-cli compile --fqbn arduino:avr:uno --output-dir /tmp/avr-build-dir /tmp/avr-sketch-dir/sketch.ino
ls /tmp/avr-build-dir/
ls /tmp/avr-sketch-dir/
arduino-cli compile --fqbn arduino:avr:uno --output-dir /tmp/avr-build-dir /tmp/avr-sketch-dir/sketch.ino
ls /tmp/avr-sketch-dir/ | cat -A
mv /tmp/avr-sketch-dir/sketch.ino /tmp/avr-sketch-dir/avr-sketch-dir.ino
arduino-cli compile --fqbn arduino:avr:uno --output-dir /tmp/avr-build-dir /tmp/avr-sketch-dir/
sudo chmod -R 777 /tmp/avr-build-dir
ls -ld /tmp/avr-build-dir
arduino-cli compile --fqbn arduino:avr:uno --output-dir /tmp/avr-build-dir /tmp/avr-sketch-dir/avr-sketch-dir.ino
ls /tmp/avr-build-dir/
arduino-cli board list
tar -czvf avr-files.tar.gz /tmp/avr-build-dir/
ls -l | grep avr-files.tar.gz
pkg install rclone
mv avr-files.tar.gz ~/storage/shared/
pkg install rclone
sudo apt update
sudo apt install rclone
rclone version
rclone config
sudo apt update
sudo apt install rclone
rclone config
curl --upload-file ./avr-files.tar.gz https://transfer.sh/avr-files.tar.gz
termux-setup-storage
mv avr-files.tar.gz ~/storage/shared/
mv avr-files.tar.gz /var/www/html/
hostname -I
sudo mv avr-files.tar.gz /var/www/html/
sudo apt update
sudo apt install apache2 -y
sudo systemctl status apache2
sudo systemctl start apache2
sudo systemctl status apache2.service
sudo nano /etc/apache2/ports.conf
sudo systemctl restart apache2
python3 -m http.server 8080
cd /opt/ar3s-server/
python3 -m http.server 8080
sudo lsof -i :8080
git clone https://github.com/G3nosss/avr_files.git
cd avr_files
mv /opt/ar3s-server/avr-files.tar.gz /opt/ar3s-server/avr_files/
cd /opt/ar3s-server
mv /opt/ar3s-server/avr-files.tar.gz /opt/ar3s-server/avr_files/
ls -1
mv /opt/ar3s-server/avr-files /opt/ar3s-server/avr_files/
find / -name "avr-files.tar.gz" 2>/dev/null
mv /var/www/html/avr-files.tar.gz /opt/ar3s-server/avr_files/
sudo mv /var/www/html/avr-files.tar.gz /opt/ar3s-server/avr_files/
cd /opt/ar3s-server/avr_files/
ls -l
git add avr-files.tar.gz
git commit -m "Added avr-files.tar.gz"
git push origin main
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type:  application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello\");delay(1000);}","fqbn":"arduino:avr:uno"}'
sudo journalctl -u ar3s-avr. service -n 50
docker run --rm -v /tmp/test-sketch:/work/sketch -v /var/www/ar3s/firmware/avr:/work/build arduino-cli-avr compile --fqbn arduino:avr:uno --output-dir /work/build --warnings all /work/sketch
which arduino-cli
which arduino
which platformio
which avr-gcc
arduino-cli version
ls -l /var/www/ar3s/firmware/avr
ls -l /tmp
mv /tmp/test-sketch/<original-sketch-name>.ino /tmp/test-sketch/sketch.ino
find /tmp -type f -name "*.ino"
sudo -i
sudo chmod -R u+rwX /tmp /var
sudo chown -R ubuntu:ubuntu /tmp /var
ls -ld /tmp /var /tmp/test-sketch /var/www/ar3s /var/www/ar3s/firmware/avr
find /tmp -type f -name "*.ino"
cat /tmp/test-sketch/sketch.ino
cat /tmp/test-avr-sketch/sketch.ino
cat /tmp/avr-sketch-dir/avr-sketch-dir.ino
mv /tmp/avr-sketch-dir/avr-sketch-dir.ino /tmp/test-sketch/sketch.ino
docker run --rm   -v /tmp/test-sketch:/work/sketch   -v /var/www/ar3s/firmware/avr:/work/build   arduino-cli-avr compile   --fqbn arduino:avr:uno   --output-dir /work/build   --warnings all /work/sketch/sketch.ino
ls -l /var/www/ar3s/firmware/avr
cd /opt/ar3s-server/server/index.js
cd /opt/ar3s-server/server
sudo nano /opt/ar3s-server/server/index.js
sudo systemctl restart ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello Cloud\");delay(1000);}", "fqbn":"arduino:avr:uno"}'
sudo systemctl status ar3s-avr.service
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
sudo netstat -tuln | grep 8081
sudo apt update
sudo apt install net-tools -y
sudo netstat -tuln | grep 8081
sudo ss -tuln | grep 8081
sudo journalctl -u ar3s-avr.service -n 50 --no-pager
node /opt/ar3s-server/server/index.js
nano /opt/ar3s-server/package.json
sudo systemctl restart ar3s-avr.service
node /opt/ar3s-server/server/index.js
mv /opt/ar3s-server/server/index.js /opt/ar3s-server/server/index.cjs
sudo nano /etc/systemd/system/ar3s-avr.service
sudo systemctl daemon-reload
sudo systemctl restart ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello\");delay(1000);}", "fqbn":"arduino:avr:uno"}'
sudo journalctl -u ar3s-avr.service -n 50
sudo systemctl restart ar3s-avr.service
sudo journalctl -u ar3s-avr.service -n 50 --no-pager
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello World\");delay(1000);}", "fqbn":"arduino:avr:uno"}'
ls -l /var/www/ar3s/firmware/avr/
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello World\");delay(1000);}", "fqbn":"arduino:avr:uno"}'
sudo rm -rf /tmp/test-sketch/* /var/www/ar3s/firmware/avr/*
sudo rm -rf /tmp/test-sketch/*
sudo rm -rf /tmp/ar3s/*
sudo find /var/www/ar3s/firmware/avr/ -type f -name "*.hex" -mmin +60 -exec rm {} \;
sudo nano /etc/systemd/system/ar3s-avr.service
sudo systemctl daemon-reload
sudo systemctl enable ar3s-avr.service
sudo apt install logrotate -y
sudo nano /etc/logrotate.d/ar3s-avr
sudo reboot
sudo systemctl status ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello After Reboot\");delay(1000);}", "fqbn":"arduino:avr:uno"}'
nano /opt/ar3s-server/docs/setup-instructions.txt
sudo rm /opt/ar3s-server/docs/setup-instructions.txt
tar -czvf ar3s-backup.tar.gz /opt/ar3s-server /etc/systemd/system/ar3s-avr.service
scp ubuntu@ar3s-compiler.duckdns.org:/opt/ar3s-server/ar3s-backup.tar.gz ./
|ls ~/.ssh/
ls ~/.ssh/
ssh-keygen -t rsa -b 4096 -C "not.g3nos@gmail.com"
ls ~/.ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t rsa -b 4096 -C "not.g3nos@gmail.com"
ls -l ~/.ssh
ssh-copy-id ubuntu@ar3s-compiler.duckdns.org
scp /opt/ar3s-server/ar3s-backup.tar.gz ubuntu@ar3s-compiler.duckdns.org:/opt/ar3s-server/
cat ~/.ssh/id_rsa.pub
ssh ubuntu@ar3s-compiler.duckdns.org
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
ssh ubuntu@ar3s-compiler.duckdns.org
ls -l /opt/ar3s-server/ar3s-backup.tar.gz
tar -czvf /opt/ar3s-server/ar3s-backup.tar.gz /opt/ar3s-server /etc/systemd/system/ar3s-avr.service
scp /opt/ar3s-server/ar3s-backup.tar.gz ubuntu@ar3s-compiler.duckdns.org:/opt/ar3s-server/
ssh ubuntu@ar3s-compiler.duckdns.org
ls -l /opt/ar3s-server/ar3s-backup.tar.gz
sudo tar -xzvf /opt/ar3s-server/ar3s-backup.tar.gz -C /
sudo systemctl daemon-reload
sudo systemctl restart ar3s-avr.service
sudo systemctl status ar3s-avr.service
curl -i -X POST http://127.0.0.1:8081/api/build/avr -H 'Content-Type: application/json' -d '{"code":"void setup(){Serial.begin(115200);} void loop(){Serial.println(\"Hello Restore\");delay(1000);}", "fqbn":"arduino:avr:uno"}'
ls -l /var/www/ar3s/firmware/avr/
sudo certbot certificates
dig A ar3s-compiler.duckdns.org
dig AAAA ar3s-compiler.duckdns.org
sudo ufw status | grep 80
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
sudo ufw status | grep 80
sudo certbot renew --force-renewal -v
dig +short ar3s-compiler.duckdns.org
sudo certbot renew --dry-run
sudo nano /etc/nginx/sites-available/ar3s-compiler.duckdns.org.conf
dig CAA ar3s-compiler.duckdns.org
dig @ns1.duckdns.org CAA duckdns.org
dig @ns2.duckdns.org CAA duckdns.org
sudo certbot renew --dry-run
sudo certbot certonly --manual --preferred-challenges dns -d ar3s-compiler.duckdns.org
sudo certbot status
nano ~/.ssh/authorized_keys
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCryaOT1NbVR5eFYVkDe5jFJrurPhURSIUxS9EjGxmHxF5YYEkus3fU51rp6Q+WTLNfA3EFApj1POsoWHF49JxZ2NHetlO8FeM8vG8JIas3b345s8wyvcOaNSDra9HSrlE1AmV22Al8svt3EVHRXTkr9LmKRF/AgyLbABXzZylqb1uC6Y0cWPNVXwpTTiVPSQG1Nh2mw8Fw9E44n9WZiHMr3LJkMSPMkmmuZ3Mk75US1JSY9ASftozGci3hh8inIj0lO7BAYNwSvmW6NNNXiFsv1nUvDE7Gr03lD2ltuEwK7SI8IgY5Pm19KV8bNZou0iihdNDPAsvvx2b32qRyFME/" > ~/.ssh/authorized_keys
cd /opt/ar3s-server
git status
git init
git config user.name "G3nosss"
git config user.email "not.g3nos@gmail.com"
cat > .gitignore << 'EOF'
node_modules/
.env
*. log
/tmp/
/var/
. DS_Store
EOF

git remote remove origin 2>/dev/null
git remote add origin https://github.com/G3nosss/ar3s-ide.v2.git
git remote -v
git add .
git rm --cached avr_files
git -f rm --cached avr_files
git -f --cached avr_files
rm -rf avr_files/.git
git rm -r --cached avr_files
git rm -f --cached avr_files
git status
nano .gitignore
git add .
git commit -m "Remove avr_files submodule and ignore it"
git push origin main
git branch -M main
git push -u origin main
git pull origin main --rebase
git status
git add <file>
git rebase --continue
git push origin main
cd /opt/ar3s-server
git fetch origin
git checkout copilot/redesign-homepage-ui-features
git pull origin copilot/redesign-homepage-ui-features
npm start
npm install
npm start
cat package.json
nano package.json
npm install react-scripts --save
npm outdated
npm install svgo@latest
npm start
mkdir public
nano public/index.html
npm start
mkdir src
nano src/index.js
touch src/index.css
npm start
nano package.json
touch .babelrc
nano .babelrc
npm install @babel/preset-env @babel/preset-react --save-dev
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader --save-dev
npm start
npm install react react-dom
npm list react react-dom
node -v
npm -v
npm install -g n
sudo npm install -g n
npm config set prefix '~/.npm-global'
nano ~/.bashrc
source ~/.bashrc
echo $PATH
npm install -g n
sudo npm install -g n
n stable
sudo n stable
node -v
npm -v
npm install -g npm
sudo npm install -g npm
npm -v
npm start
echo $PATH
npm config get prefix
git branch
npm run build
sudo npm run build
git status
git add .
git commit -m "Updated homepage and related configuration files"
git push origin copilot/redesign-homepage-ui-features
nano package.json
npm run build
nano /opt/ar3s-server/.npmrc
npx serve -s build
nano /opt/ar3s-server/.npmrc
source ~/.bashrc
npx serve -s build
sudo netstat -tuln | grep 3000
npx http-server build
nano package.json
npm run build
npx http-server build
ps aux | grep http-server
npx http-server build
sudo netstat -tuln | grep 8082
curl http://127.0.0.1:9090
curl http://172.31.1.192:9090
pkill -f http-server
npx http-server build -a 0.0.0.0 -p 8082
sudo netstat -tuln | grep 8082
npx http-server build -a 0.0.0.0 -p 8082
sudo lsof -i :8082
sudo npx http-server build -a 0.0.0.0 -p 8082
sudo lsof -i :8082
sudo tail -20 /var/log/syslog
curl http://127.0.0.1:8082
The `http-server` is tasked with serving the `build` directory. If this directory is missing files or incomplete, the server may fail silently or immediately stop.
1. Verify the `build/` directory contents:
ls build
sudo npm install -g http-server
ls build
mkdir build
cd build
mkdir -p build/static/js build/static/css build/static/media
echo '<!DOCTYPE html><html><head><title>Welcome</title></head><body><h1>Hello, World!</h1></body></html>' > build/index.html
echo "console.log('Hello from JS');" > build/static/js/app.js
echo "body { margin: 0; font-family: Arial; }" > build/static/css/style.css
echo "Sample media files" > build/static/media/readme.txt
ls -R build
http-server build -a 0.0.0.0 -p 9090
curl -s http://checkip.amazonaws.com
sudo ufw status
http-server build -a 172.31.1.192 -p 9090
curl http://40.192.18.24:9090
http-server build -a 0.0.0.0 -p 9090
curl -s http://checkip.amazonaws.com
curl http://40.192.18.24:9090
curl http://172.31.1.192:9090
sudo netstat -tuln
http-server build -a 0.0.0.0 -p 9090
sudo netstat -tuln | grep 9090
curl http://127.0.0.1:9090
curl http://172.31.1.192:9090
DEBUG=* http-server build -a 0.0.0.0 -p 9090
ls 
ls
ps aux | grep http-server
sudo netstat -tuln | grep 9090
curl http://127.0.0.1:9090
curl http://172.31.1.192:9090
ls -R build
sudo netstat -tuln | grep 9090
http-server build -a 0.0.0.0 -p 9090
sudo netstat -tuln | grep 9090
http-server build -a 0.0.0.0 -p 8081
sudo netstat -tuln | grep 8081
sudo lsof -i :9090
sudo lsof -i :8081
curl http://127.0.0.1:9090
curl http://172.31.1.192:9090
curl http://127.0.0.1:9090
curl http://172.31.1.192:9090
curl http://40.192.18.24:9090
ls build
npm run build
cat package.json
sudo package.json
nano package.json
npm install
npm run build
cat package.json
ls public
mkdir public
nano public/index.html
npm run build
mkdir src
cat src/index.js
cat index.js
nano src/index.js
mkdir src/components
nano src/components/Home.js
npm run build
ls build
http-server build -a 0.0.0.0 -p 9090
curl http://127.0.0.1:9090
http-server build -a 0.0.0.0 -p 9090 &
sudo netstat -tuln | grep 9090
curl http://127.0.0.1:9090
ifconfig
http-server build -a 172.31.1.192 -p 9090 &
http-server build -a 172.31.1.192 -p 9090
sudo lsof -i :9090
curl http://checkip.amazonaws.com
nslookup ar3s.run.place
http-server build -a 0.0.0.0 -p 80
sudo kill -9 15870
sudo rm -rf /var/www/html/*
sudo cp -r ~/build/* /var/www/html/
sudo systemctl restart apache2
sudo apt update
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d ar3s.run.place
rm /home/ubuntu/package.json
cd /home/ubuntu/ar3s-ide.v2
npm install
cd /home/ubuntu/ar3s-ide.v2
npm install
cdcd /home/ubuntu/ar3s-ide.v2/server
cd /home/ubuntu/ar3s-ide.v2/server
npm cache clean --force
npm config ser registry https://registry.npmjs.org/
npm config set registry https://registry.npmjs.org/
npm install react-app-rewired --no-bin-links
nano /home/ubuntu/ar3s-ide.v2/config-overrides.js
cat package.json
cat /home/ubuntu/ar3s-ide.v2/package.json
nano /home/ubuntu/ar3s-ide.v2/config-overrides.js
nano /home/ubuntu/ar3s-ide.v2/package.json
npm run build
cd /home/ubuntu/ar3s-ide.v2
ls /home/ubuntu/ar3s-ide.v2/config-overrides.js
rm -rf build
npm install
npm run build
ls node_modules/react-app-rewired
npm install react-app-rewired --save-dev
cat package.json
rm -rf build
npm run build
nano /home/ubuntu/ar3s-ide.v2/config-overrides.js
npm run build
mkdir /home/ubuntu/ar3s-ide.v2/src
touch /home/ubuntu/ar3s-ide.v2/src/index.js
npm run build
nano /home/ubuntu/ar3s-ide.v2/src/index.js
npm run build
npm run deploy
git checkout gh-pages
ls
git branch -r
git branch gh-pages
git push origin gh-pages
git checkout gh-pages
git pull origin gh-pages
git checkout gh-pages
git pull origin gh-pages
rm -rf build
npm cache clean --force
rm -rf node_modules package-lock.json
git checkout main
npm install
npm run build
npm run deploy
git checkout gh-pages
cat index.html
nano /home/ubuntu/ar3s-ide.v2/package.json
npm run build
npm run deploy
nano /home/ubuntu/ar3s-ide.v2/package.json
touch /home/ubuntu/ar3s-ide.v2/build/.nojekyll
npm run build
npm run deploy
git checkout gh-pages
ls
cat index.html
ls -R build
nano /home/ubuntu/ar3s-ide.v2/config-overrides.js
nano /home/ubuntu/ar3s-ide.v2/public/index.html
rm -rf build
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
npm run build
npm run deploy
ls -R build
sudo apt update
sudo apt install nginx -y
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
sudo nano /etc/nginx/sites-available/ar3s
sudo ln -s /etc/nginx/sites-available/ar3s /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
curl -s http://checkip.amazonaws.com
sudo ufw allow http
sudo ufw allow https
sudo ufw reload
nslookup ar3s.run.place
sudo certbot --nginx -d ar3s.run.place
sudo nginx -T
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx
sudo nginx -T
sudo nano /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-enabled/ar3s
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --force-renewal
sudo nano /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
ls /etc/letsencrypt/live/ar3s.run.place/
sudo ls /etc/letsencrypt/live/ar3s.run.place/
sudo nginx -t
sudo systemctl reload nginx
sudo journalctl -xeu nginx.service
sudo systemctl status nginx
ls -la /etc/nginx/sites-enabled
sudo sed -n '1,200p' /etc/nginx/sites-enabled/default
sudo sed -n '1,200p' /etc/nginx/sites-enabled/ar3s
sudo sed -n '1,200p' /etc/nginx/sites-enabled/ar3s.conf
sudo unlink /etc/nginx/sites-enabled/default
sudo unlink /etc/nginx/sites-enabled/ar3s
sudo nginx -t
sudo systemctl reload nginx
ls -la /var/www/ar3s
sudo ss -ltnp | grep 8081
sudo ss -ltnp | egrep ':80|:443'
cd /var/www/ar3s
sudo unlink /etc/nginx/sites-enabled/default
cd home/ubuntu
cd home
sudo unlink /etc/nginx/sites-enabled/ar3s
sudo nginx -t
sudo systemctl reload nginx
curl -I http://ar3s-compiler.duckdns.org
curl -I https://ar3s-compiler.duckdns.org
curl -I https://ar3s-compiler.duckdns.org/api/
curl -s https://ar3s-compiler.duckdns.org | head -n 30
head -n 30 /var/www/ar3s/index.html
cd /var/www/ar3s
git status
git pull
npm install
ls -la
ls -la ~
ls -la /home/ubuntu
cd /home/ubuntu/ar3s-ide.v2
git status
git branch
git pull origin main
npm install
npm run build
cd ~/ar3s-ide.v2
git checkout main
git pull origin main
nano package.json
nano package-lock.json
npm run build
sudo rm -rf /var/www/ar3s/*
sudo cp -r build/* /var/www/ar3s/
nano package.json
cd ~/ar3s-ide.v2
git checkout main
git pull origin main
npm install
npm run build
sudo rm -rf /var/www/ar3s/*
sudo cp -r build/* /var/www/ar3s/
cd ~/ar3s-ide.v2
git checkout main
npm install
npm run build
sudo rm -rf /var/www/ar3s/*
sudo cp -r build/* /var/www/ar3s/
root /var/www/ar3s;
ls /etc/nginx/sites-enabled
sudo nano /etc/nginx/sites-enabled/ar3s.conf
sudo nginx -t && sudo systemctl reload nginx
ls -la /var/www/ar3s
ls -la /var/www/ar3s/static/css
ls -la ~/ar3s-ide.v2/build
ls -la ~/ar3s-ide.v2/build/static
ls -la ~/ar3s-ide.v2/build/static/css
grep -n "static/css" ~/ar3s-ide.v2/build/index.html
head -n 20 /var/www/ar3s/index.html
ls -la ~/ar3s-ide.v2/assets
ls -la ~/ar3s-ide.v2/pages
sudo rm -rf /var/www/ar3s/*
sudo cp -r ~/ar3s-ide.v2/index.html /var/www/ar3s/
sudo cp -r ~/ar3s-ide.v2/assets /var/www/ar3s/
sudo cp -r ~/ar3s-ide.v2/pages /var/www/ar3s/
sudo nginx -t
sudo systemctl reload nginx
ls -la /var/www/ar3s
ls -la /var/www/ar3s/assets
ls -la /var/www/ar3s/pages
curl -I http://localhost/assets/styles.css
curl -I http://localhost/pages/ide.html
curl -I https://ar3s-compiler.duckdns.org/assets/styles.css
curl -k -I https://localhost/assets/styles.css
npm uninstall gh-pages
git branch
nano package.json
cd ar-side.v2
cd G3nosss/ar3s-ide.v2
ls
cd ar3s-ide.v2
git status
cd server
npm install express cors dotenv @google/generative-ai
nano .env
nano server.js
node server.js
nano server/package.json
cd server
rm package.json
npm init -y
npm install express cors dotenv @google/generative-ai
node server.js
cd server
ls
cd server/ar3s-ide.v2
cd ar3s-ide.v2
cd server
node server.js
ls
cd ar3s-ide.v2/server
node server.js
sudo lsof -i :3000
sudo kill -9 9235
node server.js
cd /var/www/ar3s
sudo git pull origin main
npm install
sudo git reset --hard origin/main
sudo git pull origin main
cd /var/www/ar3s/ar3s-ide.v2/server
cd ar3s-ide.v2/server
cd ~
ls
cd ar3s-ide.v2/server
ls
npm install
node server.js
sudo nano /etc/nginx/sites-available/default
sudo systemctl reload nginx
nano ar3s-ide.v2/server/.env
cd ~/ar3s-ide.v2/server && nano .env
sudo nano /etc/nginx/sites-available/default
nano /home/ubuntu/ar3s-ide.v2/server/.env
sudo nginx -t
sudo systemctl reload nginx
cd ~/ar3s-ide.v2/server
node server.js
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx
cd ~/ar3s-ide.v2/server
node server.js
ls
cd ar3s-ide.v2/server
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAB2MAxy3eeb5KMI-0cV1ljh1WhUWM50hE"     -H 'Content-Type: application/json'     -X POST     -d '{
      "contents": [{
        "parts":[{"text": "Verify this key is working"}]
      }]
    }'
nano ~/ar3s-ide.v2/server/server.js
sudo killall -9 node
node server.js &
sudo killall -9 node
sudo lsof -i :3000
sudo kill -9 10211
sudo lsof -i :3000
node server.js &
sudo kill -9 $(sudo lsof -t -i:3000)
sudo lsof -i :3000
sudo mv /var/www/ar3s /var/www/ar3s_backup
sudo cp -r ~/ar3s-ide.v2/public /var/www/ar3s
sudo systemctl reload nginx
node server.js
ls
cd ar3s-ide.v2/server
sudo nano /etc/nginx/sites-available/default
sudo systemctl reload nginx
cat ~/ar3s-ide.v2/server/.env
nano .env
curl -X POST http://localhost:3000/api/copilot -H "Content-Type: application/json" -d '{"prompt":"test"}'
node server.js &
sudo lsof -i :3000
sudo kill -9 9867
sudo lsof -i :3000
node server.js &
curl -X POST http://localhost:3000/api/copilot -H "Content-Type: application/json" -d '{"prompt":"test"}'
nano ~/ar3s-ide.v2/server/.env
curl -X POST http://localhost:3000/api/copilot -H "Content-Type: application/json" -d '{"prompt":"test"}'
sudo killall node
cd ~/ar3s-ide.v2/server
node server.js &
echo "GEMINI_API_KEY=AIzaSyAB2MAxy3eeb5KMI-0cV1ljh1WhUWM50hE" > ~/ar3s-ide.v2/server/.env
echo "PORT=3000" >> ~/ar3s-ide.v2/server/.env
sudo killall -9 node
cat ~/ar3s-ide.v2/server/.env
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAB2MAxy3eeb5KMI-0cV1ljh1WhUWM50hE"     -H 'Content-Type: application/json'     -X POST     -d '{
      "contents": [{
        "parts":[{"text": "Verify this key is working"}]
      }]
    }'
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAB2MAxy3eeb5KMI-0cV1ljh1WhUWM50hE"     -H 'Content-Type: application/json'     -X POST     -d '{
      "contents": [{
        "parts":[{"text": "Verify this key is working"}]
      }]
    }'
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAB2MAxy3eeb5KMI-0cV1ljh1WhUWM50hE"     -H 'Content-Type: application/json'     -X POST     -d '{
      "contents": [{
        "parts":[{"text": "Verify this key is working"}]
      }]
    }'
ls
nano server.js
sudo killall -9 node
nano server.js &
node server.js &
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAB2MAxy3eeb5KMI-0cV1ljh1WhUWM50hE"     -H 'Content-Type: application/json'     -X POST     -d '{
      "contents": [{
        "parts":[{"text": "Verify this key is working"}]
      }]
    }'
ls -la ~/ar3s-ide.v2/public
sudo nano /etc/nginx/sites-available/default
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
ls
cd ar3s-ide.v2/server
node server.js &
ls
cd ar3s-ide.v2/server
grep -r "ar3s-compiler.duckdns.org" /etc/nginx/sites-enabled/
ls -lah /etc/nginx/sites-enabled/
nano ar3s.conf
sudo rm /etc/nginx/sites-enabled/ar3s.conf
sudo nginx -t && sudo systemctl restart nginx
sudo kill -9 10211
sudo lsof -i :3000
sudo kill -9 10554
sudo lsof -i :3000
cd ~/ar3s-ide.v2/server
node server.js
sudo tail -f /var/log/nginx/error.log
sudo chown -R www-data:www-data /home/ubuntu/ar3s-ide.v2/public
sudo chmod -R 755 /home/ubuntu/ar3s-ide.v2/public
sudo nginx -t
sudo systemctl reload nginx
sudo nginx -t
cd ~/ar3s-ide.v2/server
node server.js &
sudo chmod o+x /home/ubuntu
sudo chown -R www-data:www-data /home/ubuntu/ar3s-ide.v2/public
sudo chmod -R 755 /home/ubuntu/ar3s-ide.v2/public
sudo chmod o+x /home/ubuntu
sudo chown -R www-data:www-data /home/ubuntu/ar3s-ide.v2/public
sudo chown -R 755 /home/ubuntu/ar3s-ide.v2/public
sudo nano /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl restart nginx
sudo killall -9 node
cd ~/ar3s-ide.v2/server
node server.js
ls
cd ar3s-ide.v2/server
sudo journalctl -u ar3s-brain -n 200 --no-pager
sudo nginx -t
sudo systemctl status nginx
ls -la /etc/nginx/sites-enabled/
git log --oneline -n 10
git checkout <last-good-commit>
ls
source ~/.bashrc
cd ar3s-compiler.v2
ls
cd ar3s-ide.v2
aider --model ollama_chat/gemma3
pipx uninstall aider-chat
pip cache purge
ps aux --sort=-%mem | head -n 5
curl -fsSL https://ollama.com/install.sh | sh
ollama pull gemma3
pipx install --force aider-chat
pipx ensurepath
pipx --force ensurepath
pipx ensurepath
--force
pipx ensurepath --force
source ~/.bashrc
ollama pull gemma3
ls
cd ar3s-ide.v2
aider --model ollama_chat/gemma3
ls
cd ar3s-compiler.v2
cd ar3s-ide.v2
source ~/.bashrc
aider --model ollama_chat/gemma3
ls
cd home/ubuntu
cd home
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
sudo sysctl vm.swappiness=100
sudo sync
echo 3 | sudo tee /proc/sys/vm/drop_caches
free -h
ls
cd ar3s-ide.v2
aider --model ollama_chat/gemma3:1b
ollama pull gemma3:1b
ollama list
ollama rm gemma3
ollama list
export OLLAMA_API_BASE=http://localhost:11434
aider --model ollama_chat/gemma3:1b
nano ~/.bashrc
source ~/.bashrc
echo &GEMINI_API_KEY
echo $GEMINI_API_KEY
pipx ensurepath
source ~/.bashrc
cd ~/ar3ss-ide.v2
ls
cd ~/ar3ss-ide.v2
cd ~/ar3s-ide.v2
aider --model gemini/gemini-3-flash-preview
export GEMINI_API_KEY="AIzaSyB3j0hKcB31vltNao8IOw8J_IRtOTKSK3E" && aider --model gemini/gemini-3-flash-preview
echo $GEMINI_API_KEY
source ~/.bashrc
export GEMINI_API_KEY="AIzaSyB3j0hKcB31vltNao8IOw8J_IRtOTKSK3E" && aider --model gemini/gemini-3-flash-preview
ls
cd ar3s-ide.v2
git pull origin main
npm install
npm run build
git fetch origin
get reset --hard origin/main
git reset --hard origin/main
npm install
npm run build
sudo systemctl reset nginx
sudo systemctl restart nginx
npm run build
sudo systemctl restart nginx
ls -F
ls server/
nohup node server/index.cjs
node server/index.cjs
sudo fuser -k 8081/tcp
node server/index.cjs
sudo killall -9 node
sudo lsof -i :8081
systemctl status 5438
sudo systemctl restart ar3s-avr.service
sudo lsof -i :8081
sudo journalctl -u ar3s-avr.service -n 50 --no-page
sudo tail -n 20 /var/log/nginx/error.log
grep -r "proxy_pass" /etc/nginx/sites-enabled/
ls /etc/nginx/sites-enabled/
sudo nano /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
systemctl status nginx.service
sudo nano /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
cat server/index.cjs
ls
cat server/index.cjs
cd ar3s-ide.v2
ls
cat server/index.cjs
nano server/index.cjs
sudo systemctl restart ar3s-avr.service
ls -R pages/
nano server/index.cjs
sudo systemctl restart ar3s-avr.service
ls
sudo cp ~/ar3s-ide.v2/server/index.cjs /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
git branch -a
ls
cd ar3s-ide.v2
git branch -a
npm install
npm run build
cat package.json
ls -F build/
ls
ls -F build/
sudo cp -r . /opt/ar3s-server/
sudo systemctl restart ar3s-avr.service
ls
cd ar3s-ide.v2
ls
cd index.html
nano index.html
sudo systemctl restart ar3s-avr.service
nano index.html
grep -r ""instagram" .
grep -r "instagram" .
grep -r "instagram" . --exclude-dir=node_modules
nano index.html
sudo cp index.html /opt/ar3s-server/
ollama rm gemma3:1b
pipx uninstall aider-chat
pipx uninstall-all
sudo apt remove pipx -y
python3 -m pip uninstall pipx -y
sudo apt autoremove -y
sudo apt-get clean
npm cache clean --force
df -h
docker system prune -a -f
df -h
ls
cd ar3s-ide.v2
docker build -t arduino-cli-avr .
docker build -t arduino-cli-avr -f Dockerfile.arduino-cli .
docker images
curl ifconfig.me
ls
sudo nano /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
sudo certbot --nginx -d ar3s.me -d www.ar3s.me
sudo nano /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
grep -r "duckdns" . --exclude-dir=node_modules
cd ~/ar3s-ide.v2
sed -i 's/ar3s-compiler.duckdns.org/ar3s.me/g' assets/stm-flasher.js assets/esp-custom-enhanced.js pages/esp-custom.html pages/stm-flasher.html
sudo cp -r . /opt/ar3s-server/
sudo nano /opt/ar3s-server/server/index.cjs
ls
npm install groq-sdk
ls
cd server/index.cjs
nano index.cjs
ls
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
sudo nano /opt/ar3s-server/server/index.cjs
npm install groq-sdk
sudo systemctl restart ar3s-avr.service
sudo systemctl reload nginx
node /opt/ar3s-server/server/index.cjs
cd /opt/ar3s-server
npm install groq-sdk
node /opt/ar3s-server/server/index.cjs
sudo nano /opt/ar3s-server/server/index.cjs
node /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
node /opt/ar3s-server/server/index.cjs
sudo nano /opt/ar3s-server/server/index.cjs
sudo killall -9 node
sudo systemctl restart ar3s-avr.service
node /opt/ar3s-server/server/index.cjs
sudo journalctl -u ar3s-avr -f
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
npm install groq-sdk cors
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
sudo journalctl -u ar3s-avr -f
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
ls
cd ar3s-ide.v2
ls
cd build
cd server.cjs
cd /server/index.cjs
cd server
ls
nano index.cjs
nano ide.html
ls
cd ar3s-ide.v2
sudo nano /opt/ar3s-ide.v2/ide.html
nano /opt/ar3s-server/pages/ide.html
nano /opt/ar3s-server/pages/ide.js
sudo systemctl restart ar3s-avr.service
sudo nano /opt/ar3s-server/pages/ide.html
sudo nano /opt/ar3s-server/server/index.cjs
sudo nano /opt/ar3s-server/pages/ide.html
sudo killall node
sudo systemctl restart ar3s-avr.service
sudo nano /opt/ar3s-server/pages/ide.html
sudo nano /opt/ar3s-server/server/index.cjs
sudo cp /opt/ar3s-server/server/index.cjs /opt/ar3s-server/server/index.cjs.bak
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
cd /server/index.cjs
nano /opt/ar3s-server/pages/index.cjs
nano /opt/ar3s-server/server/index.cjs
ls
sudo rm /opt/ar3s-server/pages/index.cjs
ls /opt/ar3s-server/pages/
sudo systemctl restart ar3s-avr.service
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
sudo nano /opt/ar3s-server/server/index.cjs
sudo systemctl restart ar3s-avr.service
ls
