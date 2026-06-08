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
    // 1. Check local status first
    const statusOutput = runCmd('git status --porcelain');
    const isDirty = !!statusOutput;

    if (isDirty) {
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
    }

    // 2. Now that working directory is clean, pull down remote version
    runCmd(`git pull --rebase origin ${BRANCH}`);

    // 3. If we committed changes locally, push them up
    if (isDirty) {
      console.log('Pushing to GitHub...');
      runCmd(`git push origin ${BRANCH}`);
      console.log('Sync complete!');
    }

  } catch (err) {
    console.error(`Error during sync: ${err.message}`);
  }
}

// Initial sync on start
sync();

// Set interval
setInterval(sync, INTERVAL_MS);
