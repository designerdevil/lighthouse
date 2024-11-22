/**
 *  MOBILE AND DESKTOP CONFIGS
    https://github.com/GoogleChrome/lighthouse/blob/main/core/config/desktop-config.js
    https://github.com/GoogleChrome/lighthouse/blob/main/core/config/lr-mobile-config.js
*/

const MOTOGPOWER_EMULATION_METRICS = {
    mobile: true,
    width: 412,
    height: 823,
    // This value has some interesting ramifications for image-size-responsive, see:
    // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
    deviceScaleFactor: 1.75,
    disabled: false,
};
const DESKTOP_EMULATION_METRICS = {
    mobile: false,
    width: 1350,
    height: 940,
    deviceScaleFactor: 1,
    disabled: false,
};
const MOTOG4_USERAGENT = 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'; // eslint-disable-line max-len
const DESKTOP_USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'; // eslint-disable-line max-len

const userAgents = {
    mobile: MOTOG4_USERAGENT,
    desktop: DESKTOP_USERAGENT,
};
const screenEmulationMetrics = {
    mobile: MOTOGPOWER_EMULATION_METRICS,
    desktop: DESKTOP_EMULATION_METRICS,
};

// ======= DESKTOP CONFIG =============
const desktopConfig = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: 'desktop',
        screenEmulation: screenEmulationMetrics.desktop,
        emulatedUserAgent: userAgents.desktop,
    },
};

// ========= MOBILE CONFIG ===========
const mobileConfig = {
    extends: 'lighthouse:default',
    settings: {
        screenEmulation: screenEmulationMetrics.mobile,
        emulatedUserAgent: userAgents.mobile,
        maxWaitForFcp: 15 * 1000,
        maxWaitForLoad: 35 * 1000,
        throttling: {
            cpuSlowdownMultiplier: 1.5,
        },
        skipAudits: [
            'uses-http2',
            'bf-cache',
        ],
    },
};


const config = { ...mobileConfig };

export default config;