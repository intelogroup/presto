import { test, expect } from "@playwright/test";

test.describe("Accessibility basics", () => {
  test("page has lang attribute on html element", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");
  });

  test("heading hierarchy is correct on home page", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Presto");
  });

  test("file input is accessible for assistive technology", async ({
    page,
  }) => {
    await page.goto("/");
    // The file input exists in the DOM (screen readers can interact with it)
    const input = page.locator('input[type="file"]');
    await expect(input).toHaveCount(1);
    // Accept attribute guides assistive tech about allowed types
    const accept = await input.getAttribute("accept");
    expect(accept).toBeTruthy();
  });

  test("interactive elements are keyboard-focusable", async ({ page }) => {
    await page.goto("/");

    // The theme selector combobox should be focusable
    const combobox = page.getByRole("combobox");
    await combobox.focus();
    await expect(combobox).toBeFocused();

    // The submit button is disabled (no file selected), but it still has
    // tabindex="0" — verify its tabindex attribute is set for keyboard access
    const btn = page.getByRole("button", { name: "Generate slides" });
    const tabindex = await btn.getAttribute("tabindex");
    expect(tabindex).toBe("0");
  });

  test("theme selector is keyboard-operable", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("combobox");
    await trigger.focus();
    await page.keyboard.press("Enter");

    // Dropdown should now be visible
    await expect(
      page.getByRole("option", { name: "Dark Tech" })
    ).toBeVisible({ timeout: 3000 });
  });

  test("status page heading reflects state for screen readers", async ({
    page,
  }) => {
    const JOB_ID = "a11y-test-job";
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
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Done!");
  });
});
