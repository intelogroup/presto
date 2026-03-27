import { test, expect } from "@playwright/test";

const JOB_ID = "test-job-abc123";

test.describe("Status page — processing state", () => {
  test("displays job ID and Processing heading while polling", async ({
    page,
  }) => {
    // Mock status endpoint to return a mid-pipeline state
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
    await expect(page.getByText(JOB_ID)).toBeVisible();
  });

  test("shows progress tracker with step indicators", async ({ page }) => {
    await page.route(`**/api/status/${JOB_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jobId: JOB_ID,
          status: "processing",
          step: "generating_slides",
        }),
      })
    );

    await page.goto(`/status/${JOB_ID}`);

    // All pipeline steps should be visible
    await expect(page.getByText("Uploading")).toBeVisible();
    await expect(page.getByText("Preprocessing")).toBeVisible();
    await expect(page.getByText("Transcribing audio")).toBeVisible();
    await expect(page.getByText("Generating slides")).toBeVisible();
    await expect(page.getByText("Rendering video")).toBeVisible();
    await expect(page.getByText("Done")).toBeVisible();

    // Current step should have an "In progress" badge
    await expect(page.getByText("In progress")).toBeVisible();

    // Progress bar should exist
    const progress = page.locator('[role="progressbar"]');
    await expect(progress).toBeVisible();
  });
});

test.describe("Status page — done state", () => {
  test("shows Done heading and download button", async ({ page }) => {
    await page.route(`**/api/status/${JOB_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jobId: JOB_ID,
          status: "done",
          step: "done",
        }),
      })
    );

    await page.goto(`/status/${JOB_ID}`);

    await expect(page.locator("h1")).toHaveText("Done!");

    // Download button
    const downloadLink = page.locator(`a[href="/api/download/${JOB_ID}"]`);
    await expect(downloadLink).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download video" })
    ).toBeVisible();

    // Start over button
    await expect(
      page.getByRole("button", { name: "Start over" })
    ).toBeVisible();
  });
});

test.describe("Status page — error state", () => {
  test("shows Failed heading and error message", async ({ page }) => {
    await page.route(`**/api/status/${JOB_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jobId: JOB_ID,
          status: "error",
          step: "transcribing",
          error: "Transcription service timed out",
        }),
      })
    );

    await page.goto(`/status/${JOB_ID}`);

    await expect(page.locator("h1")).toHaveText("Failed");
    await expect(
      page.getByText("Transcription service timed out")
    ).toBeVisible();

    // Try again button
    await expect(
      page.getByRole("button", { name: "Try again" })
    ).toBeVisible();
  });

  test("Try again button links to home page", async ({ page }) => {
    await page.route(`**/api/status/${JOB_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          jobId: JOB_ID,
          status: "error",
          step: "rendering",
          error: "Render failed",
        }),
      })
    );

    await page.goto(`/status/${JOB_ID}`);

    const tryAgainLink = page.locator('a[href="/"]').filter({
      has: page.getByRole("button", { name: "Try again" }),
    });
    await expect(tryAgainLink).toBeVisible();
  });
});

test.describe("Status page — network error", () => {
  test("shows retry message when API is unreachable", async ({ page }) => {
    await page.route(`**/api/status/${JOB_ID}`, (route) => route.abort());

    await page.goto(`/status/${JOB_ID}`);

    // Initially shows "Connecting…", then after fetch fails shows retry message
    await expect(
      page.getByText("Lost connection — retrying…")
    ).toBeVisible({ timeout: 10000 });
  });
});
