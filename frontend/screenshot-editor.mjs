import { chromium } from "playwright";

const BASE = "http://localhost:3099";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Intercept the status API to return "done" so we see the editor
await page.route("**/api/status/**", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ jobId: "demo-1", status: "ready", step: "done" }),
  })
);

await page.goto(`${BASE}/app/project/demo-1`, { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: "/tmp/screenshots/09-editor-ready.png", fullPage: false });
console.log("✓ 09-editor-ready");

// Also capture the legacy status page with a mid-pipeline state
const page2 = await context.newPage();
await page2.route("**/api/status/**", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ jobId: "demo-1", status: "processing", step: "generating_slides" }),
  })
);
await page2.goto(`${BASE}/status/demo-1`, { waitUntil: "networkidle", timeout: 15000 });
await page2.waitForTimeout(2000);
await page2.screenshot({ path: "/tmp/screenshots/10-status-active.png", fullPage: false });
console.log("✓ 10-status-active");

await browser.close();
