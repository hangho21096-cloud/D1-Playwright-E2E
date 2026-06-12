import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  globalTeardown: require.resolve('./utils/globalTeardown'),
  
  reporter: [
    // 1. Native HTML Reporter
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    
    // 2. Premium Allure Reporter
    ['allure-playwright', { 
        detail: true, 
        outputFolder: 'allure-results',
        suiteTitle: false,
        environmentInfo: {
            Environment: process.env.ENV || 'Undefined',
            Framework: 'Playwright + TypeScript',
            Node_JS: process.version
        }
    }],

    // 3. Centralized ReportPortal Integration
    ['@reportportal/agent-js-playwright', {
        endpoint: 'https://your-reportportal-instance/api/v1',
        token: 'YOUR_REPORTPORTAL_ACCESS_TOKEN',
        launch: 'IVY_E2E_Test_Run',
        project: 'ivy_project',
        description: 'Playwright Automated End-to-End Suite',
        attributes: [ { key: 'env', value: 'staging' } ]
    }]
  ],

  use: {
    headless: false,
    viewport: null, // 1. Bỏ giới hạn kích thước viewport mặc định để full màn hình
    launchOptions: {
      args: ['--start-maximized'], // 2. Lệnh ép Chrome mở to hết cỡ ngay khi bật
    },
    // Capture screenshot specifically on failure to attach to reports
    screenshot: 'only-on-failure',
    // Capture video of executions
    video: 'retain-on-failure', // Change to 'on' if you want video for successful tests too
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});