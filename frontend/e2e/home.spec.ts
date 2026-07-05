import { expect, test } from "@playwright/test";
import users from "../src/i18n/en/users.json";

test("home page loads and shows the fetched users", async ({ page }) => {
  await page.route("**/api/graphql", (route) =>
    route.fulfill({
      json: {
        data: {
          users: [
            { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
            { id: "2", name: "Alan Turing", email: "alan@example.com" },
          ],
        },
      },
    }),
  );

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: users.heading }),
  ).toBeVisible();
  await expect(page.getByText("Ada Lovelace")).toBeVisible();
  await expect(page.getByText("Alan Turing")).toBeVisible();
});
