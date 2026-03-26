import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

// Helper: create a temp file for upload tests
function createTempFile(name: string, sizeBytes: number): string {
  const dir = path.join(__dirname, ".tmp");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fp = path.join(dir, name);
  fs.writeFileSync(fp, Buffer.alloc(sizeBytes));
  return fp;
}

test.describe("Upload form interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("selecting a valid file enables the submit button and shows filename", async ({
    page,
  }) => {
    const filePath = createTempFile("sample.mp4", 1024);
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(filePath);

    // Filename should appear in the drop zone
    await expect(page.getByText("sample.mp4")).toBeVisible();

    // Button should now be enabled
    const btn = page.getByRole("button", { name: "Generate slides" });
    await expect(btn).toBeEnabled();
  });

  test("shows error for files exceeding 500 MB", async ({ page }) => {
    // We cannot actually create a 500MB+ file in a test, so we rely on the
    // client-side size check. We create a small file and use JavaScript to
    // simulate a large one via the drop zone.
    await page.evaluate(() => {
      const dropZone = document.querySelector("div.border-dashed");
      if (!dropZone) return;
      const bigFile = new File(["x"], "huge.mp4", { type: "video/mp4" });
      // Override size getter
      Object.defineProperty(bigFile, "size", {
        value: 600 * 1024 * 1024,
      });
      const dt = new DataTransfer();
      dt.items.add(bigFile);
      const dropEvent = new DragEvent("drop", {
        dataTransfer: dt,
        bubbles: true,
      });
      dropZone.dispatchEvent(dropEvent);
    });

    await expect(
      page.getByText("File too large")
    ).toBeVisible({ timeout: 5000 });
  });

  test("submit button shows Uploading state and handles API errors gracefully", async ({
    page,
  }) => {
    // Mock the upload-token endpoint to return an error
    await page.route("**/api/upload-token", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Service unavailable" }),
      })
    );

    // Pick a file to enable the button
    const filePath = createTempFile("test.mp4", 512);
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(filePath);

    const btn = page.getByRole("button", { name: "Generate slides" });
    await btn.click();

    // Should show the error from the mocked endpoint
    await expect(page.getByText("Service unavailable")).toBeVisible({
      timeout: 5000,
    });

    // Button should revert from "Uploading…" back to "Generate slides"
    await expect(btn).toHaveText("Generate slides");
  });
});

test.describe("Theme selector", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens the dropdown and shows theme options", async ({ page }) => {
    const trigger = page.getByRole("combobox");
    await trigger.click();

    // All three themes should be visible in the dropdown
    await expect(page.getByRole("option", { name: "Dark Tech" })).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Dashboard / KPI" })
    ).toBeVisible();
    await expect(
      page.getByRole("option", { name: "Academic" })
    ).toBeVisible();
  });

  test("selecting a theme updates the trigger value", async ({ page }) => {
    const trigger = page.getByRole("combobox");
    await trigger.click();
    await page.getByRole("option", { name: "Academic" }).click();

    // The Select component shows the value (P17) after selection
    // Verify the combobox no longer shows the placeholder
    await expect(trigger).not.toHaveText(/Auto-select theme/);
  });
});
