import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

try {
  // clean built files
  spawnSync('pnpm', ['run', 'clean'], { stdio: 'inherit' });
  console.log('✓ Cleaned built files');

  // build spec
  spawnSync('pnpm', ['run', '--filter', 'spec', 'build'], { stdio: 'inherit' });

  // build frontend
  spawnSync('pnpm', ['run', '--filter', 'frontend', 'build'], { stdio: 'inherit' });

  // build backend
  spawnSync('pnpm', ['run', '--filter', 'backend', 'build'], { stdio: 'inherit' });

  // check existing directory
  if (!fs.existsSync('./packages/backend/built/web')) {
    fs.mkdirSync('./packages/backend/built/web', { recursive: true });
    console.log('✓ Created directory: web\n');
  }

  // copy build frontend file
  execSync('cp -f -r ./packages/frontend/built/* ./packages/backend/built/web');

  console.log("✓ Copied frontend's built directory\n");
  console.log('Start server: pnpm run start\n');
} catch {}
