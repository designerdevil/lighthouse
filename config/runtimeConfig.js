export default {
  output: ['html', 'json'] /*["csv", "json", "html"]*/,
  chromeFlags: ['--headless'],
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
}


/* SETTING TEMPLATE EXAMPLE */
/*
{
  onlyCategories: [
    'best-practices',
  ],
  onlyAudits: [
    'is-on-https',
    'viewport',
    'user-timings',
    'critical-request-chains',
    'render-blocking-resources',
    'installable-manifest',
    'splash-screen',
    'themed-omnibox',
    'aria-valid-attr',
    'aria-allowed-attr',
    'color-contrast',
    'image-alt',
    'label',
    'tabindex',
    'content-width',
  ],
}
*/