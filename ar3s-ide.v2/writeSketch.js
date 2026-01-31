import fs from 'fs';
import path from 'path';

const sketchDir = "/tmp/avr-sketch-dir";
const code = `
void setup() {
  Serial.begin(115200);
}

void loop() {
}
`;

import { mkdirSync, existsSync, writeFileSync } from 'fs';
if (!existsSync(sketchDir)) {
  mkdirSync(sketchDir, { recursive: true });
}

writeFileSync(path.join(sketchDir, "sketch.ino"), code);

console.log("File written to:", path.join(sketchDir, "sketch.ino"));
