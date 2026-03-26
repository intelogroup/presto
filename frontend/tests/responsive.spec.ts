import { test, expect, devices } from "@playwright/test";

test.describe("Responsive design", () => {
  test("home page renders correctly on mobile viewport", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      ...devices["iPhone 13"],
    });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("h1")).toHaveText("Presto");
    await expect(
      page.getByText("Drop a video or audio file here")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate slides" })
    ).toBeVisible();

    // Main container should not overflow
    const main = page.locator("main");
    const box = await main.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(devices["iPhone 13"].viewport.width);

    await context.close();
  });

  test("home page renders correctly on tablet viewport", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      ...devices["iPad (gen 7)"],
    });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.locator("h1")).toHaveText("Presto");
    const card = page.locator("div.bg-white.rounded-xl");
    await expect(card).toBeVisible();

    await context.close();
  });

  test("status page renders correctly on mobile viewport", async ({
    browser,
  }) => {
    const JOB_ID = "responsive-test-123";
    const context = await browser.newContext({
      ...devices["iPhone 13"],
    });
    const page = await context.newPage();

    await page.route(`**/api/status/${JOB_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jobId: JOB_ID,
          status: "processing",
          step: "transcribing",
        }),
      })
    );

    await page.goto(`/status/${JOB_ID}`);
    await expect(page.locator("h1")).toHaveText("Processing…");
    await expect(page.getByText("In progress")).toBeVisible();

    await context.close();
  });
});
