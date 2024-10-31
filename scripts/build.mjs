import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

try {
  // clean built files
  spawnSync('npm', [ 'run', 'clean' ], { stdio: 'inherit' });
  console.log("✓ Cleaned built files");

  // build frontend
  spawnSync('npm', [ 'run', 'build', '-w', 'packages/frontend' ], { stdio: 'inherit' });

  // build backend
  spawnSync('npm', [ 'run', 'build', '-w', 'packages/backend' ], { stdio: 'inherit' });

  // check existing directory
  if (!fs.existsSync('./packages/backend/built/web')) {
    fs.mkdirSync('./packages/backend/built/web', { recursive: true });
    console.log('✓ Created directory: web\n');
  }

  // copy build frontend file
  execSync("cp -f -r ./packages/frontend/built/* ./packages/backend/built/web");

  console.log("✓ Copied frontend's built directory\n");
  console.log("Start server: npm run start\n");
} catch {

}
