import { spawn, spawnSync } from 'child_process';
import psTree from 'ps-tree';

const pids = [];

spawnSync('pnpm', ['run', 'clean'], { stdio: 'inherit' });

const backProc = spawn('pnpm', ['run', '--filter', 'backend', 'watch']);
const frontProc = spawn('pnpm', ['run', '--filter', 'frontend', 'watch']);

backProc.stdout.on('data', (data) => {
  process.stdout.write(data);
  if (data.includes('Watching for file changes')) {
    psTree(backProc.pid, (err, children) => {
      //console.log(children);
      children.forEach((child) => {
        pids.push(child.PID);
      });
    });
  }
});

backProc.stderr.on('data', (data) => {
  process.stderr.write(data);
});

frontProc.stdout.on('data', (data) => {
  process.stdout.write(data);
  if (data.includes('Local')) {
    psTree(frontProc.pid, (err, children) => {
      // console.log(children);
      children.forEach((child) => {
        pids.push(child.PID);
      });
    });
  }
});

frontProc.stderr.on('data', (data) => {
  process.stderr.write(data);
});

const cleanup = () => {
  console.log('You will kill following process (pid).');
  console.log(pids);
  pids.forEach((pid) => {
    try {
      process.kill(pid);
    } catch (e) {
      // nice catch
    }
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGQUIT', cleanup);
