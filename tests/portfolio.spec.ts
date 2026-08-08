import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const LINKEDIN_URL = 'https://www.linkedin.com/in/shaibalmuhtadee';
const GITHUB_URL = 'https://github.com/shaibalmuhtadee';

test('renders verified identity, metadata, and content', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Shaibal Muhtadee — Software Engineer');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://shaibalmuhtadee.com/',
  );
  await expect(
    page.getByRole('heading', { level: 1, name: 'I build reliable software systems.' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Zebra Technologies' })).toBeVisible();
  await expect(page.getByText('more than 200 autonomous robots').first()).toBeVisible();
  await expect(
    page.getByText(
      'Canada-wide; open to qualifying U.S. roles through TN status or employer-sponsored H-1B',
    ),
  ).toBeVisible();
});

test('renders every section and project in the approved order', async ({ page }) => {
  await page.goto('/');

  const sectionIds = await page
    .locator('main section[id]')
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(sectionIds).toEqual(['experience', 'work', 'about', 'contact']);

  const work = page.locator('#work');
  for (const title of ['Inokta', 'Searchington', 'ChromaMap']) {
    await expect(work.getByRole('heading', { level: 3, name: title, exact: true })).toBeVisible();
  }
  await expect(work.getByRole('heading', { level: 4, name: 'GanttWise' })).toBeVisible();

  const searchington = work.locator('article').filter({
    has: page.getByRole('heading', { name: 'Searchington', exact: true }),
  });
  await expect(searchington).toContainText(
    'In local query-loading tests, Redis caching reduced response time by more than 70% compared with reading the same results from SQLite.',
  );

  const chromaMap = work.locator('article').filter({
    has: page.getByRole('heading', { name: 'ChromaMap', exact: true }),
  });
  await expect(chromaMap).not.toContainText(/(?:more than|over)?\s*300\s*%/i);

  await expect(
    work.getByText(
      'Source code and demos are private; descriptions are limited to publishable work.',
      { exact: true },
    ),
  ).toBeVisible();
  expect(
    await work.evaluate((section) => {
      const note = section.querySelector('.private-note--lead');
      const firstProject = section.querySelector('.project-entry');
      if (!note || !firstProject) return false;
      return Boolean(note.compareDocumentPosition(firstProject) & Node.DOCUMENT_POSITION_FOLLOWING);
    }),
  ).toBe(true);
  await expect(work.getByRole('link')).toHaveCount(0);
  await expect(work.getByRole('button')).toHaveCount(0);
  await expect(work.locator('img, picture, video, audio, iframe, canvas, svg')).toHaveCount(0);
});

test('uses approved public profiles without exposing private contact details or a resume', async ({
  page,
}) => {
  await page.goto('/');

  const profiles = page.getByRole('navigation', { name: 'Professional profiles' });
  await expect(profiles.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute(
    'href',
    LINKEDIN_URL,
  );
  await expect(profiles.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute(
    'href',
    GITHUB_URL,
  );
  await expect(
    page.locator('#contact').getByRole('link', { name: /Connect on LinkedIn/i }),
  ).toHaveAttribute('href', LINKEDIN_URL);
  await expect(
    page.locator('#contact').getByRole('link', { name: /View GitHub profile/i }),
  ).toHaveAttribute('href', GITHUB_URL);

  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="resume" i], a[href$=".pdf" i]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /resume/i })).toHaveCount(0);

  const pageText = await page.locator('body').innerText();
  expect(pageText).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  expect(pageText).not.toMatch(/(?:\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?[2-9]\d{2}[\s.-]?\d{4}/);
});

test('keeps identity actions visible in a short desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');

  const profiles = page.getByRole('navigation', { name: 'Professional profiles' });
  const actions = [
    page.getByRole('link', { name: 'View experience' }),
    profiles.getByRole('link', { name: 'LinkedIn', exact: true }),
    profiles.getByRole('link', { name: 'GitHub', exact: true }),
    page.locator('[data-theme-toggle]'),
  ];

  for (const action of actions) {
    await expect(action).toBeVisible();
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(720);
  }
});

test('persists a manual theme choice', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Light mode' });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Dark mode' })).toBeVisible();
  await expect(page.locator('[data-theme-status]')).toHaveText('Light theme active');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await context.close();
});

test('falls back to system preference for invalid or unavailable storage', async ({ browser }) => {
  const invalidContext = await browser.newContext({ colorScheme: 'dark' });
  await invalidContext.addInitScript(() => localStorage.setItem('shaibal-theme', 'sepia'));
  const invalidPage = await invalidContext.newPage();
  await invalidPage.goto('/');
  await expect(invalidPage.getByRole('button', { name: 'Light mode' })).toBeVisible();
  await invalidContext.close();

  const blockedContext = await browser.newContext({ colorScheme: 'light' });
  await blockedContext.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  const blockedPage = await blockedContext.newPage();
  await blockedPage.goto('/');
  await expect(blockedPage.getByRole('button', { name: 'Dark mode' })).toBeVisible();
  await blockedContext.close();
});

test('keeps content usable without JavaScript and follows the dark system theme', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: 'I build reliable software systems.' }),
  ).toBeVisible();
  await expect(page.locator('[data-theme-toggle]')).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
    .toBe('rgb(7, 19, 31)');
  await context.close();
});

test('has no automated accessibility violations or responsive horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await expect(page.locator('[data-theme-toggle]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
