module.exports = {
  output: ['html', 'json'] /*["csv", "json", "html"]*/,
  chromeFlags: ['--headless'],
  logLevel: 'info',
  view: true,
  onlyCategories: [
    'performance',
    'pwa',
    'best-practices',
    'seo',
    'accessibility'
  ],
  emulatedFormFactor: 'mobile',
}
