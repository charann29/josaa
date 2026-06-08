const { execSync } = require('child_process');

// Configuration
const INTERVAL_MS = 5000; // Check every 5 seconds
const BRANCH = 'main';

console.log('=== Git Auto-Sync Daemon Started ===');
console.log(`Monitoring directory: ${process.cwd()}`);
console.log(`Checking for changes every ${INTERVAL_MS / 1000} seconds...`);

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    throw new Error(err.stderr ? err.stderr.trim() : err.message);
  }
}

function sync() {
  try {
    // 1. Pull down the latest version from remote first
    runCmd(`git pull --rebase origin ${BRANCH}`);

    // 2. Check local status
    const statusOutput = runCmd('git status --porcelain');
    if (!statusOutput) {
      // No local changes
      return;
    }

    console.log('Detected local changes:');
    console.log(statusOutput);

    // Parse changed files for commit message
    const lines = statusOutput.split('\n').filter(Boolean);
    const changedFiles = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      return parts[parts.length - 1];
    });

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const commitMsg = `Auto-commit: updated ${changedFiles.join(', ')} at ${timestamp}`;

    console.log('Staging changes...');
    runCmd('git add -A');

    console.log(`Committing changes: "${commitMsg}"`);
    runCmd(`git commit -m "${commitMsg}"`);

    console.log('Pushing to GitHub...');
    runCmd(`git push origin ${BRANCH}`);
    console.log('Sync complete!');

  } catch (err) {
    console.error(`Error during sync: ${err.message}`);
  }
}

// Initial sync on start
sync();

// Set interval
setInterval(sync, INTERVAL_MS);
