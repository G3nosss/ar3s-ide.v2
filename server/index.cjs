const fs = require("fs");
const { exec } = require("child_process");
const express = require("express");
const app = express();
app.use(express.json());

const FIRMWARE_DIR = "/var/www/ar3s/firmware/avr/";
const SKETCH_DIR = "/tmp/test-sketch/";
const SKETCH_FILE = "sketch.ino";

app.post("/api/build/avr", (req, res) => {
  const { code, fqbn } = req.body;

  if (!fs.existsSync(SKETCH_DIR)) fs.mkdirSync(SKETCH_DIR, { recursive: true });
  if (!fs.existsSync(FIRMWARE_DIR)) fs.mkdirSync(FIRMWARE_DIR, { recursive: true });

  const sketchFilePath = `${SKETCH_DIR}${SKETCH_FILE}`;
  fs.writeFileSync(sketchFilePath, code);

  const buildCommand = `docker run --rm \
    -v ${SKETCH_DIR}:/work/sketch \
    -v ${FIRMWARE_DIR}:/work/build \
    arduino-cli-avr \
    compile --fqbn ${fqbn} --output-dir /work/build --warnings all /work/sketch/sketch.ino`;

  exec(buildCommand, (err, stdout, stderr) => {
    if (err) {
      console.error("Build failed:", stderr);
      return res.status(500).json({ error: "Compilation failed", details: stderr });
    }

    const hexFiles = fs.readdirSync(FIRMWARE_DIR)
      .filter((file) => file.endsWith(".hex"))
      .map((fileName) => ({
        fileName,
        fullPath: `${FIRMWARE_DIR}${fileName}`,
        updateTime: fs.statSync(`${FIRMWARE_DIR}${fileName}`).mtimeMs
      }))
      .sort((a, b) => b.updateTime - a.updateTime); // Sort by modified time desc

    const latestHex = hexFiles.length > 0 ? hexFiles[0].fileName : null;
    if (!latestHex) {
      return res.status(500).json({ error: "No HEX file produced" });
    }

    return res.json({
      artifactUrl: `/firmware/avr/${latestHex}`,
      log: stdout
    });
  });
});

// Start server
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Ar3s AVR build API listening on port ${port}`);
});
