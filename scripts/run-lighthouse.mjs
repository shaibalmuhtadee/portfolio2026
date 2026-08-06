import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const LHCI_VERSION = '0.15.1';
const onWindows = process.platform === 'win32';
const localCli = path.resolve('node_modules', '.bin', onWindows ? 'lhci.CMD' : 'lhci');
const command = existsSync(localCli) ? localCli : onWindows ? 'pnpm.CMD' : 'pnpm';
const commandPrefix = existsSync(localCli) ? [] : ['dlx', `@lhci/cli@${LHCI_VERSION}`];
const shell = onWindows;

const run = (args, options = {}) => {
  const result = spawnSync(command, [...commandPrefix, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell,
    stdio: options.capture ? 'pipe' : 'inherit',
    env: options.env ?? process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stdout ?? '');
      process.stderr.write(result.stderr ?? '');
    }
    throw new Error(`Lighthouse CI command failed with exit code ${result.status}.`);
  }
  return `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
};

const { chromium } = await import('@playwright/test');
const chromePath = chromium.executablePath();
const chromeVersion = spawnSync(chromePath, ['--version'], { encoding: 'utf8' });
if (chromeVersion.error || chromeVersion.status !== 0) {
  throw chromeVersion.error ?? new Error('Unable to read the pinned Chromium version.');
}

process.stdout.write(`Node ${process.version}\n`);
process.stdout.write(`Lighthouse CI ${run(['--version'], { capture: true })}\n`);
process.stdout.write(`${chromeVersion.stdout.trim()}\n`);

rmSync(path.resolve('.lighthouse-reports'), { recursive: true, force: true });

for (const formFactor of ['mobile', 'desktop']) {
  rmSync(path.resolve('.lighthouseci'), { recursive: true, force: true });
  process.stdout.write(`Running five ${formFactor} Lighthouse passes with median assertions.\n`);
  run(['autorun', `--config=./lighthouserc.${formFactor}.cjs`], {
    env: { ...process.env, CHROME_PATH: chromePath },
  });
}

rmSync(path.resolve('.lighthouseci'), { recursive: true, force: true });
