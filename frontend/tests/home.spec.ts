import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with correct heading and description", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Presto");
    await expect(
      page.getByText("Upload a video or audio file")
    ).toBeVisible();
  });

  test("renders the upload form container", async ({ page }) => {
    // The white card that wraps UploadForm
    const card = page.locator("div.bg-white.rounded-xl");
    await expect(card).toBeVisible();
  });

  test("has a hidden file input with correct accept types", async ({
    page,
  }) => {
    const input = page.locator('input[type="file"]');
    await expect(input).toHaveCount(1);
    // It is visually hidden via className="hidden"
    await expect(input).toBeHidden();
    const accept = await input.getAttribute("accept");
    expect(accept).toContain("video/mp4");
    expect(accept).toContain("audio/mpeg");
  });

  test("shows drop zone placeholder text", async ({ page }) => {
    await expect(
      page.getByText("Drop a video or audio file here")
    ).toBeVisible();
    await expect(
      page.getByText("MP4, MOV, WebM, MP3, M4A")
    ).toBeVisible();
  });

  test("has the Generate slides button (disabled by default)", async ({
    page,
  }) => {
    const btn = page.getByRole("button", { name: "Generate slides" });
    await expect(btn).toBeVisible();
    await expect(btn).toBeDisabled();
  });

  test("has a theme selector trigger", async ({ page }) => {
    const trigger = page.getByRole("combobox");
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveText(/Auto-select theme/);
  });
});
