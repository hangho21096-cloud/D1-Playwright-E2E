## Testing rules

- Framework: Playwright with TypeScript
- Locator strategy: prefer getByRole, getByTestId. Never use CSS class selectors.
- Folder structure: tests/ for spec files, pages/ for page objects
- Naming: kebab-case for files. login-page.spec.ts, not LoginPage.test.ts
- Assertions: always use soft assertions where multiple checks exist
- Avoid all hard waits (page.waitForTimeout). Use auto-waiting or explicit waitFor conditions.
- Run command: npx playwright test
- CI: GitHub Actions with sharded parallel execution
Do not generate abstract code.

Generate a FULLY runnable Playwright test that:
- launches browser
- performs real clicks, typing, navigation
- uses test.step() for each action
- logs user behavior clearly

If any step is skipped or simplified, the answer is invalid.
- MUST open the browser and start from homepage
- MUST simulate a real user journey step-by-step
- MUST include navigation between pages (not direct URL jumps)
- MUST use test.step() for each user action
- MUST include realistic waits (waitForURL, waitForSelector)
- MUST include assertions after each step
- MUST NOT mock anything
- Language: All test cases, manuals, documentations, and code comments MUST be written in English.