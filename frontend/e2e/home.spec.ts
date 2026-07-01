import { expect, test } from "@playwright/test";

test("home page loads and shows getting started heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /edit the page\.tsx file/i }),
  ).toBeVisible();
});
