import { expect, test } from '@playwright/test';

const SITE_URL = 'https://shaibalmuhtadee.com/';
const SOCIAL_IMAGE = 'https://shaibalmuhtadee.com/images/shaibal-muhtadee-og.png';
const LINKEDIN_URL = 'https://www.linkedin.com/in/shaibalmuhtadee';
const GITHUB_URL = 'https://github.com/shaibalmuhtadee';

test('publishes complete canonical, social, and crawler metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', SITE_URL);
  await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute('href', '/sitemap.xml');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', SOCIAL_IMAGE);
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
    'content',
    'image/png',
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /Shaibal/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', SOCIAL_IMAGE);
});

test('publishes privacy-safe ProfilePage and Person structured data', async ({ page }) => {
  await page.goto('/');

  const source = await page.locator('script[type="application/ld+json"]').textContent();
  expect(source).not.toBeNull();
  const data = JSON.parse(source!);
  expect(data['@type']).toBe('ProfilePage');
  expect(data.url).toBe(SITE_URL);
  expect(data.mainEntity).toMatchObject({
    '@type': 'Person',
    name: 'Shaibal Muhtadee',
    url: SITE_URL,
    jobTitle: 'Software Engineer',
    sameAs: [LINKEDIN_URL, GITHUB_URL],
  });
  expect(data.mainEntity.alumniOf.name).toBe('University of Toronto');
  expect(data.mainEntity.knowsAbout).toContain('Rust');
  expect(JSON.stringify(data)).not.toMatch(/email|telephone|mailto:|tel:/i);
});

test('serves the social image, robots file, and sitemap with valid content', async ({
  request,
}) => {
  const imageResponse = await request.get('/images/shaibal-muhtadee-og.png');
  expect(imageResponse.ok()).toBe(true);
  expect(imageResponse.headers()['content-type']).toBe('image/png');
  const image = await imageResponse.body();
  expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect({ width: image.readUInt32BE(16), height: image.readUInt32BE(20) }).toEqual({
    width: 1200,
    height: 630,
  });

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  await expect(robots.text()).resolves.toBe(
    'User-agent: *\nAllow: /\nSitemap: https://shaibalmuhtadee.com/sitemap.xml\n',
  );

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(sitemap.headers()['content-type']).toContain('application/xml');
  expect(await sitemap.text()).toContain('<loc>https://shaibalmuhtadee.com/</loc>');

  const missing = await request.get('/this-route-does-not-exist');
  expect(missing.status()).toBe(404);
});
