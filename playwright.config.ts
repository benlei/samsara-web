import {devices, PlaywrightTestConfig} from '@playwright/test'
import path from 'path'

const PORT = process.env.PORT || 8788

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
    // Concise 'dot' for CI, default 'list' when running locally
    reporter: 'list',
    // Timeout per test
    timeout: 15 * 1000,
    // Test directory
    testDir: path.join(__dirname, 'test/e2e'),
    // If a test fails, retry it additional 2 times
    retries: 0,
    // Artifacts folder where screenshots, videos, and traces are stored.
    outputDir: path.join(__dirname, 'test-results'),

    // Run your local dev server before starting the tests:
    // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
    webServer: {
        command: 'npx wrangler pages dev .vercel/output/static --compatibility-flags=streams_enable_constructors',
        url: baseURL,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },

    use: {
        // Use baseURL so to make navigations relative.
        // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
        baseURL,

        screenshot: 'only-on-failure',
        video: 'retain-on-failure',

        // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
        // contextOptions: {
        //   ignoreHTTPSErrors: true,
        // },
    },

    projects: [
        {
            name: 'Desktop Chrome',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 5'],
            },
        },
        // was black screen for some reason. prob ok to just do 1 mobile device.
        {
            name: 'Mobile Safari',
            use: devices['iPhone 12'],
        },
    ],
}
export default config
