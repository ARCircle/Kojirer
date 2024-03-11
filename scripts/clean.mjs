import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.rmSync(__dirname + '/../packages/backend/built', { recursive: true, force: true })
fs.rmSync(__dirname + '/../packages/frontend/built', { recursive: true, force: true })