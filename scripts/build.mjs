import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

// clean built files
const cleanResult = spawnSync('pnpm', ['run', 'clean'], { stdio: 'inherit' });
if (cleanResult.status !== 0) {
  console.error('✗ Failed to clean built files');
  process.exit(1);
}
console.log('✓ Cleaned built files');

// build spec
const specResult = spawnSync('pnpm', ['run', '--filter', 'spec', 'build'], { stdio: 'inherit' });
if (specResult.status !== 0) {
  console.error('✗ Failed to build spec');
  process.exit(1);
}

// build frontend
const frontendResult = spawnSync('pnpm', ['run', '--filter', 'frontend', 'build'], { stdio: 'inherit' });
if (frontendResult.status !== 0) {
  console.error('✗ Failed to build frontend');
  process.exit(1);
}

// build backend
const backendResult = spawnSync('pnpm', ['run', '--filter', 'backend', 'build'], { stdio: 'inherit' });
if (backendResult.status !== 0) {
  console.error('✗ Failed to build backend');
  process.exit(1);
}

// check existing directory
if (!fs.existsSync('./packages/backend/built/web')) {
  fs.mkdirSync('./packages/backend/built/web', { recursive: true });
  console.log('✓ Created directory: web\n');
}

// copy build frontend file
try {
  execSync('cp -f -r ./packages/frontend/built/* ./packages/backend/built/web');
  console.log("✓ Copied frontend's built directory\n");
  console.log('Start server: pnpm run start\n');
} catch (error) {
  console.error('✗ Failed to copy frontend built files');
  process.exit(1);
}
