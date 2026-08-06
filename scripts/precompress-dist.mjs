import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    else files.push(entryPath);
  }

  return files;
}

export async function precompressDist(root = path.resolve('dist')) {
  const rootStats = await stat(root).catch(() => null);
  if (!rootStats?.isDirectory()) {
    throw new Error(`Production output was not found at ${root}. Run the build first.`);
  }

  const sourceFiles = (await walk(root)).filter(
    (file) => textExtensions.has(path.extname(file).toLowerCase()) && !file.endsWith('.gz'),
  );
  let compressedBytes = 0;

  for (const file of sourceFiles) {
    const source = await readFile(file);
    const compressed = gzipSync(source, { level: 9, mtime: 0 });
    await writeFile(`${file}.gz`, compressed);
    compressedBytes += compressed.byteLength;
  }

  return { files: sourceFiles.length, compressedBytes };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  const result = await precompressDist();
  process.stdout.write(
    `Precompressed ${result.files} production files (${result.compressedBytes} gzip bytes).\n`,
  );
}
