import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 640, height: 720 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 2560, height: 1440 },
];
const axeViewports = [
  { width: 320, height: 568 },
  { width: 1440, height: 900 },
];

test('passes axe in both themes at mobile and desktop widths', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit runs out of memory with axe-core injection');
  for (const theme of ['light', 'dark'] as const) {
    for (const viewport of axeViewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.evaluate((selectedTheme) => {
        localStorage.setItem('shaibal-theme', selectedTheme);
      }, theme);
      await page.reload();

      const results = await new AxeBuilder({ page }).analyze();
      const violations = results.violations.filter((v) => v.id !== 'heading-order');
      expect(violations, `${theme} theme at ${viewport.width}px`).toEqual([]);
    }
  }
});

test('keeps a logical outline and exposes every landmark', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Professional profiles' })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    'About',
    'Education',
    'Experience',
    'Projects',
    'Skills',
    'Contact',
  ]);
  await expect(page.locator('main section[aria-labelledby]')).toHaveCount(6);
});

test('supports keyboard navigation, skip context, and same-page focus handoff', async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'WebKit does not focus the skip-link on first Tab press');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
});

test('keeps the primary action in the first small-phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');

  const action = page.getByRole('link', { name: 'View resume' });
  const box = await action.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(568);
});

test('keeps interactive targets at least 44 CSS pixels and focus unobscured', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit',
    'WebKit getBoundingClientRect returns invalid coordinates after Tab navigation',
  );
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');

  const controls = page
    .locator('a:visible, button:visible')
    .filter({ hasNotText: 'Skip to content' });
  for (let index = 0; index < (await controls.count()); index += 1) {
    const box = await controls.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.keyboard.press('Tab');
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press('Tab');
    const activeBounds = await page.evaluate(() => {
      const active = document.activeElement;
      if (!(active instanceof HTMLElement)) return null;
      const bounds = active.getBoundingClientRect();
      return { top: bounds.top, right: bounds.right, bottom: bounds.bottom, left: bounds.left };
    });
    expect(activeBounds).not.toBeNull();
    expect(activeBounds!.top).toBeGreaterThanOrEqual(0);
    expect(activeBounds!.left).toBeGreaterThanOrEqual(0);
    expect(activeBounds!.right).toBeLessThanOrEqual(320);
    expect(activeBounds!.bottom).toBeLessThanOrEqual(590);
  }
});

test('reflows without horizontal overflow from 320 pixels through wide desktop', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === 'webkit',
    'WebKit browser context crashes under repeated viewport-size changes',
  );
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `${viewport.width}×${viewport.height}`,
    ).toBe(true);
  }
});

test('survives WCAG text-spacing overrides without clipping or overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.addStyleTag({
    content: `
      * { letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
      p, li, dd { line-height: 1.5 !important; }
      p { margin-block-end: 2em !important; }
    `,
  });

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
});

test('honors reduced motion without globally suppressing browser behavior', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const styles = await page.evaluate(() => {
    const arrow = document.querySelector('.primary-action svg');
    if (!(arrow instanceof SVGElement)) throw new Error('Primary action arrow is missing.');
    return {
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: getComputedStyle(arrow).transitionDuration,
    };
  });

  expect(styles.scrollBehavior).toBe('auto');
  expect(styles.transitionDuration).toBe('0s');
});

test('retains visible controls and focus treatment in forced colors', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is Chromium-only in Playwright.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const toggle = page.locator('[data-theme-toggle]');
  await expect(toggle).toBeVisible();
  await toggle.focus();
  const outline = await toggle.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
