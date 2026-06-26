---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# Copilot Instructions for Playwright Tests
-use javascript for playwright tests
- Always use 'async/await` syntax
- Use `page.getByRole`, `page.getByLabel`, `page.getByTestId` locators (in that priority order)
- Wrap tests in `test.describe` blocks with clear feature names
- Each test must have at least one `expect` assertion
- Use `test.beforeEach` for navigation and setup
- Follow the Page Object Model pattern located in `./helpers/`
- Add a comment above each test explaining what it verifies