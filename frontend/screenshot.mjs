import { chromium } from "playwright";

const BASE = "http://localhost:3099";
const pages = [
  { name: "01-landing-hero", url: "/", viewport: { width: 1440, height: 900 } },
  { name: "02-landing-full", url: "/", viewport: { width: 1440, height: 900 }, fullPage: true },
  { name: "03-landing-mobile", url: "/", viewport: { width: 390, height: 844 }, fullPage: true },
  { name: "04-login", url: "/login", viewport: { width: 1440, height: 900 } },
  { name: "05-dashboard", url: "/app", viewport: { width: 1440, height: 900 } },
  { name: "06-new-project", url: "/app/new", viewport: { width: 1440, height: 900 }, fullPage: true },
  { name: "07-project-editor", url: "/app/project/demo-1", viewport: { width: 1440, height: 900 } },
  { name: "08-status-legacy", url: "/status/demo-1", viewport: { width: 1440, height: 900 } },
];

const browser = await chromium.launch();

for (const p of pages) {
  const context = await browser.newContext({ viewport: p.viewport });
  const page = await context.newPage();
  await page.goto(`${BASE}${p.url}`, { waitUntil: "networkidle", timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `/tmp/screenshots/${p.name}.png`,
    fullPage: p.fullPage ?? false,
  });
  await context.close();
  console.log(`✓ ${p.name}`);
}

await browser.close();
console.log("Done — screenshots in /tmp/screenshots/");
