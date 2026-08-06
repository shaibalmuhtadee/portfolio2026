import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

import { precompressDist } from './precompress-dist.mjs';

const host = '127.0.0.1';
const port = Number.parseInt(process.env.PORT ?? '4173', 10);
const root = path.resolve('dist');
const compressibleExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

await precompressDist(root);

const isReadableFile = async (file) => {
  const details = await stat(file).catch(() => null);
  return details?.isFile() ?? false;
};

const resolveRequest = async (requestUrl = '/') => {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
  const normalized = pathname.replaceAll('\\', '/');
  const relative = normalized.replace(/^\/+/, '');
  const candidate = path.resolve(root, relative || 'index.html');

  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;
  if (await isReadableFile(candidate)) return candidate;
  if (await isReadableFile(path.join(candidate, 'index.html'))) {
    return path.join(candidate, 'index.html');
  }
  if (!path.extname(candidate) && (await isReadableFile(`${candidate}.html`))) {
    return `${candidate}.html`;
  }

  return null;
};

const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }

    const file = await resolveRequest(request.url);
    if (!file) {
      response.writeHead(404, {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end('Not found\n');
      return;
    }

    const extension = path.extname(file).toLowerCase();
    const compressible = compressibleExtensions.has(extension);
    const acceptsGzip = /(?:^|,)\s*gzip\s*(?:,|$)/i.test(request.headers['accept-encoding'] ?? '');
    const gzipFile = `${file}.gz`;
    const useGzip =
      acceptsGzip &&
      compressible &&
      (await access(gzipFile).then(
        () => true,
        () => false,
      ));
    const servedFile = useGzip ? gzipFile : file;
    const details = await stat(servedFile);
    const immutableAsset = file.includes(`${path.sep}_astro${path.sep}`);

    response.writeHead(200, {
      'Cache-Control': immutableAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
      'Content-Length': details.size,
      'Content-Type': mimeTypes.get(extension) ?? 'application/octet-stream',
      ...(compressible ? { Vary: 'Accept-Encoding' } : {}),
      ...(useGzip ? { 'Content-Encoding': 'gzip' } : {}),
      'X-Content-Type-Options': 'nosniff',
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    createReadStream(servedFile).pipe(response);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error\n');
    console.error(error);
  }
});

server.listen(port, host, () => {
  process.stdout.write(`Production server ready at http://${host}:${port}/ (gzip level 9).\n`);
});

const close = () => server.close(() => process.exit(0));
process.once('SIGINT', close);
process.once('SIGTERM', close);
