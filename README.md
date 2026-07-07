# Playwright Automation Suite

This repository contains a Playwright-based UI automation framework for end-to-end testing. It includes test cases, page object models, reusable helpers, and a GitHub Actions workflow for continuous integration.

## What is included

- Playwright test suite for web application flows
- Page Object Model structure for maintainable tests
- Allure reporting integration
- GitHub Actions CI workflow
- Sample commands for local and CI execution

## Tech stack

- Node.js
- Playwright
- JavaScript
- Allure
- GitHub Actions

## Project structure

- tests/e2e/ - end-to-end test specs
- tests/helpers/ - reusable page object classes
- tests/fixtures/ - fixtures and shared setup
- .github/workflows/ - GitHub Actions workflow files
- playwright.config.js - Playwright configuration

## Prerequisites

Make sure you have the following installed:

- Node.js 20 or later
- npm
- Git

## Local setup

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   cd YOUR_REPOSITORY_NAME
   ```

2. Install dependencies
   ```bash
   npm ci
   ```

3. Install the required Playwright browser
   ```bash
   npx playwright install --with-deps chromium
   ```

## Run tests locally

Run all tests:
```bash
npx playwright test
```

Run a specific project:
```bash
npx playwright test --project=qa-chrome
```

Generate the HTML report:
```bash
npx playwright test && npm run report:generate
```

## GitHub Actions CI setup

This repository includes a workflow in [.github/workflows/playwright.yml](.github/workflows/playwright.yml) that:

- runs on pushes and pull requests to main or master
- installs Node.js and dependencies
- installs Chromium for Playwright
- executes the Playwright suite in CI
- uploads the Playwright report as an artifact

## Sample commands used in this session

The following commands were used to set up and verify the CI flow:

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test --project=qa-chrome
git init
git add .
git commit -m "Add Playwright tests and GitHub Actions workflow"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

## GitHub repository steps

1. Create a new repository on GitHub.
2. Push the local project to GitHub.
3. Open the Actions tab in the repository.
4. Confirm the workflow runs automatically.

## Notes

- The workflow uses the environment variable APP_URL with a default value for the test target.
- The Playwright configuration runs in headless mode in CI.
- Sensitive values should be stored as GitHub Secrets instead of being committed to the repository.

## Next steps

- Add a proper README badge for the workflow status.
- Add GitHub Secrets for any required credentials.
- Improve flaky tests and stabilize the suite for full green CI.
