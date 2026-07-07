from zipfile import ZipFile, ZIP_DEFLATED
from pathlib import Path

content = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr><w:r><w:t>GitHub Actions Setup Guide for Playwright CI</w:t></w:r></w:p>
    <w:p><w:r><w:t>Project: Playwright Automation Suite</w:t></w:r></w:p>
    <w:p><w:r><w:t>This document explains how to set up GitHub Actions for a Playwright-based automation repository and how the workflow was configured during this session.</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>1. What was created</w:t></w:r></w:p>
    <w:p><w:r><w:t>- A GitHub Actions workflow file at .github/workflows/playwright.yml</w:t></w:r></w:p>
    <w:p><w:r><w:t>- A CI-friendly Playwright config in playwright.config.js</w:t></w:r></w:p>
    <w:p><w:r><w:t>- A repository README in README.md</w:t></w:r></w:p>
    <w:p><w:r><w:t>- A local Git repository initialized and committed for GitHub upload</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>2. GitHub Actions workflow overview</w:t></w:r></w:p>
    <w:p><w:r><w:t>The workflow runs automatically when code is pushed or a pull request is created on main or master. It also supports manual runs using workflow_dispatch.</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>Workflow steps</w:t></w:r></w:p>
    <w:p><w:r><w:t>1. Checkout the repository</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. Set up Node.js 20</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. Install dependencies with npm ci</w:t></w:r></w:p>
    <w:p><w:r><w:t>4. Install Chromium for Playwright</w:t></w:r></w:p>
    <w:p><w:r><w:t>5. Run the Playwright tests in CI mode</w:t></w:r></w:p>
    <w:p><w:r><w:t>6. Upload the report and test-results artifacts</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>3. Sample workflow file used in this session</w:t></w:r></w:p>
    <w:p><w:r><w:t>name: Playwright Tests</w:t></w:r></w:p>
    <w:p><w:r><w:t>on:</w:t></w:r></w:p>
    <w:p><w:r><w:t>  push:</w:t></w:r></w:p>
    <w:p><w:r><w:t>    branches: [main, master]</w:t></w:r></w:p>
    <w:p><w:r><w:t>  pull_request:</w:t></w:r></w:p>
    <w:p><w:r><w:t>    branches: [main, master]</w:t></w:r></w:p>
    <w:p><w:r><w:t>  workflow_dispatch:</w:t></w:r></w:p>
    <w:p><w:r><w:t>jobs:</w:t></w:r></w:p>
    <w:p><w:r><w:t>  test:</w:t></w:r></w:p>
    <w:p><w:r><w:t>    runs-on: ubuntu-latest</w:t></w:r></w:p>
    <w:p><w:r><w:t>    steps:</w:t></w:r></w:p>
    <w:p><w:r><w:t>      - uses: actions/checkout@v4</w:t></w:r></w:p>
    <w:p><w:r><w:t>      - uses: actions/setup-node@v4</w:t></w:r></w:p>
    <w:p><w:r><w:t>      - run: npm ci</w:t></w:r></w:p>
    <w:p><w:r><w:t>      - run: npx playwright install --with-deps chromium</w:t></w:r></w:p>
    <w:p><w:r><w:t>      - run: npx playwright test --project=qa-chrome</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>4. Commands used in this session</w:t></w:r></w:p>
    <w:p><w:r><w:t>npm ci</w:t></w:r></w:p>
    <w:p><w:r><w:t>npx playwright install --with-deps chromium</w:t></w:r></w:p>
    <w:p><w:r><w:t>npx playwright test --project=qa-chrome</w:t></w:r></w:p>
    <w:p><w:r><w:t>git init</w:t></w:r></w:p>
    <w:p><w:r><w:t>git add .</w:t></w:r></w:p>
    <w:p><w:r><w:t>git commit -m "Add Playwright tests and GitHub Actions workflow"</w:t></w:r></w:p>
    <w:p><w:r><w:t>git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git</w:t></w:r></w:p>
    <w:p><w:r><w:t>git push -u origin main</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>5. How to push the repo to GitHub</w:t></w:r></w:p>
    <w:p><w:r><w:t>1. Create a new repository on GitHub.</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. Add the remote URL and push your code.</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. Open the Actions tab in GitHub.</w:t></w:r></w:p>
    <w:p><w:r><w:t>4. Confirm the workflow starts and completes.</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>6. CI improvements and best practices</w:t></w:r></w:p>
    <w:p><w:r><w:t>- Use GitHub Secrets for credentials and environment values.</w:t></w:r></w:p>
    <w:p><w:r><w:t>- Keep the workflow simple and fast for PR validation.</w:t></w:r></w:p>
    <w:p><w:r><w:t>- Upload artifacts for debugging failed runs.</w:t></w:r></w:p>
    <w:p><w:r><w:t>- Use headless mode in CI to avoid interactive browser issues.</w:t></w:r></w:p>
    <w:p><w:r><w:t>- Split test jobs by suite or project if the suite grows.</w:t></w:r></w:p>
    <w:p><w:r><w:t> </w:t></w:r></w:p>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>7. Expected result</w:t></w:r></w:p>
    <w:p><w:r><w:t>Once the repository is pushed, GitHub Actions will run the Playwright tests automatically. You can inspect the run status, logs, screenshots, and report artifacts from the Actions page.</w:t></w:r></w:p>
    <w:sectPr/>
  </w:body>
</w:document>'''

parts = {
    '[Content_Types].xml': '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>''',
    '_rels/.rels': '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>''',
    'word/document.xml': content,
}

out = Path('GitHub-Actions-Setup-Guide.docx')
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for name, data in parts.items():
        z.writestr(name, data)

print(out.resolve())
