const assertions = {
  'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
  'categories:accessibility': ['error', { minScore: 1, aggregationMethod: 'median' }],
  'categories:seo': ['error', { minScore: 1, aggregationMethod: 'median' }],
  'largest-contentful-paint': ['error', { maxNumericValue: 2000, aggregationMethod: 'median' }],
  'first-contentful-paint': ['error', { maxNumericValue: 1500, aggregationMethod: 'median' }],
  'total-blocking-time': ['error', { maxNumericValue: 100, aggregationMethod: 'median' }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.05, aggregationMethod: 'median' }],
  'long-tasks': ['error', { maxLength: 0, aggregationMethod: 'median' }],
  'resource-summary:total:size': [
    'error',
    { maxNumericValue: 450 * 1024, aggregationMethod: 'median' },
  ],
  'resource-summary:script:size': [
    'error',
    { maxNumericValue: 50 * 1024, aggregationMethod: 'median' },
  ],
  'resource-summary:stylesheet:size': [
    'error',
    { maxNumericValue: 35 * 1024, aggregationMethod: 'median' },
  ],
  'resource-summary:document:size': [
    'error',
    { maxNumericValue: 35 * 1024, aggregationMethod: 'median' },
  ],
  'resource-summary:font:size': [
    'error',
    { maxNumericValue: 100 * 1024, aggregationMethod: 'median' },
  ],
  'resource-summary:image:size': [
    'error',
    { maxNumericValue: 200 * 1024, aggregationMethod: 'median' },
  ],
  'resource-summary:total:count': ['error', { maxNumericValue: 25, aggregationMethod: 'median' }],
  'resource-summary:third-party:count': [
    'error',
    { maxNumericValue: 0, aggregationMethod: 'median' },
  ],
};

module.exports = (formFactor) => ({
  ci: {
    collect: {
      url: ['http://127.0.0.1:4173/'],
      numberOfRuns: 5,
      startServerCommand: 'node scripts/serve-dist.mjs',
      startServerReadyPattern: 'Production server ready',
      startServerReadyTimeout: 120000,
      settings: formFactor === 'desktop' ? { preset: 'desktop' } : {},
    },
    assert: {
      assertions,
      includePassedAssertions: true,
    },
    upload: {
      target: 'filesystem',
      outputDir: `.lighthouse-reports/${formFactor}`,
    },
  },
});
