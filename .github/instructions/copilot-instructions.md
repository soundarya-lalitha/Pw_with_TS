---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# Copilot Instructions for Playwright Tests
-use typescript for playwright tests
- Always use 'async/await` syntax
- Use `page.getByRole`, `page.getByLabel`, `page.getByTestId`,`getByText`locators (in that priority order).Never use XPath or long CSS chains.
-Use web-first assertions (`await expect(locator).toBeVisible()`). Never use `waitForTimeout` or fixed sleeps.
- Wrap tests in `test.describe` blocks with clear feature names
- Each test must have at least one `expect` assertion
- Use `test.beforeEach` for navigation and setup
- Follow the Page Object Model pattern located in `./helpers/`
- Add a comment above each test explaining what it verifies