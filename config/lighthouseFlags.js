export default {
  output: ['html', 'json'] /*["csv", "json", "html"]*/,
  logLevel: 'info',
  view: true,
  emulatedFormFactor: 'desktop',
  onlyCategories: [
    'performance',
    'pwa',
    'best-practices',
    'seo',
    'accessibility'
  ],
  onlyAudits: [
    'first-meaningful-paint',
    'speed-index',
    'interactive',
  ],
};