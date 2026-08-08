import { readdirSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';
import type { Response as PlaywrightResponse } from '@playwright/test';

const KB = 1024;
const caps = {
  total: 450 * KB,
  script: 50 * KB,
  css: 35 * KB,
  document: 35 * KB,
  font: 100 * KB,
  image: 200 * KB,
  lcpImage: 120 * KB,
  requests: 25,
};

const discoverRoutes = (directory: string, prefix = ''): string[] => {
  const routes: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      routes.push(...discoverRoutes(path.join(directory, entry.name), relative));
    } else if (entry.name === 'index.html') routes.push(`/${prefix}`.replace(/\/$/, '') || '/');
  }
  return routes;
};

const routes = discoverRoutes(path.resolve('dist'));

for (const route of routes) {
  test(`stays within served transfer budgets for ${route}`, async ({ page, browserName }) => {
    test.skip(
      browserName !== 'chromium',
      'Chromium exposes the CDP cache controls used by this gate.',
    );

    const session = await page.context().newCDPSession(page);
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    const responses: PlaywrightResponse[] = [];
    page.on('response', (response) => responses.push(response));

    await page.addInitScript(() => {
      const metrics = { cls: 0, lcpUrl: '', longTasks: [] as number[] };
      Object.defineProperty(window, '__portfolioMetrics', { value: metrics, writable: false });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!shift.hadRecentInput) metrics.cls += shift.value ?? 0;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const latest = entries.at(-1) as PerformanceEntry & { url?: string };
        metrics.lcpUrl = latest?.url ?? '';
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        metrics.longTasks.push(...list.getEntries().map((entry) => entry.duration));
      }).observe({ type: 'longtask', buffered: true });
    });

    await page.goto(route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const quality = (
        window as unknown as Window & {
          __portfolioMetrics: { cls: number; lcpUrl: string; longTasks: number[] };
        }
      ).__portfolioMetrics;
      return {
        navigation: {
          name: navigation.name,
          transferSize: navigation.transferSize,
        },
        resources: resources.map((resource) => ({
          name: resource.name,
          initiatorType: resource.initiatorType,
          transferSize: resource.transferSize,
        })),
        quality,
      };
    });

    const entries = [
      { ...metrics.navigation, type: 'document' },
      ...metrics.resources.map((resource) => {
        const pathname = new URL(resource.name).pathname.toLowerCase();
        const type = pathname.endsWith('.css')
          ? 'css'
          : pathname.endsWith('.js')
            ? 'script'
            : pathname.endsWith('.woff2')
              ? 'font'
              : /\.(?:avif|gif|jpe?g|png|svg|webp)$/.test(pathname)
                ? 'image'
                : 'other';
        return { ...resource, type };
      }),
    ];
    const sum = (type?: string) =>
      entries
        .filter((entry) => !type || entry.type === type)
        .reduce((total, entry) => total + entry.transferSize, 0);
    const initialImages = entries.filter((entry) => entry.type === 'image');
    const lcpImage = entries.find((entry) => entry.name === metrics.quality.lcpUrl);
    const origin = new URL(page.url()).origin;
    const renderBlockingThirdParties = metrics.resources.filter(
      (resource) =>
        new URL(resource.name).origin !== origin &&
        ['css', 'link', 'script'].includes(resource.initiatorType),
    );

    expect(sum()).toBeLessThanOrEqual(caps.total);
    expect(sum('script')).toBeLessThanOrEqual(caps.script);
    expect(sum('css')).toBeLessThanOrEqual(caps.css);
    expect(sum('document')).toBeLessThanOrEqual(caps.document);
    expect(sum('font')).toBeLessThanOrEqual(caps.font);
    expect(sum('image')).toBeLessThanOrEqual(caps.image);
    expect(entries.length).toBeLessThanOrEqual(caps.requests);
    expect(renderBlockingThirdParties).toEqual([]);
    expect(metrics.quality.cls).toBeLessThanOrEqual(0.05);
    expect(metrics.quality.longTasks.filter((duration) => duration > 50)).toEqual([]);
    if (lcpImage) expect(lcpImage.transferSize).toBeLessThanOrEqual(caps.lcpImage);
    expect(
      initialImages.reduce((total, image) => total + image.transferSize, 0),
    ).toBeLessThanOrEqual(caps.image);

    const compressedResponses = responses.filter((response) => {
      const pathname = new URL(response.url()).pathname;
      return response.request().resourceType() === 'document' || pathname.endsWith('.css');
    });
    expect(compressedResponses.length).toBeGreaterThanOrEqual(2);
    for (const response of compressedResponses) {
      expect(await response.headerValue('content-encoding')).toBe('gzip');
    }

    await test.info().attach('resource-budget.json', {
      body: JSON.stringify({ route, entries, quality: metrics.quality }, null, 2),
      contentType: 'application/json',
    });
  });
}
