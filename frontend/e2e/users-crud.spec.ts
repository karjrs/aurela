import { expect, test } from "@playwright/test";
import messages from "../src/i18n/messages/en.json";

const ada = { id: "1", name: "Ada Lovelace", email: "ada@example.com" };
const alan = { id: "2", name: "Alan Turing", email: "alan@example.com" };

const mockGraphql = async (
  page: import("@playwright/test").Page,
  { deleteResult = true }: { deleteResult?: boolean } = {},
) => {
  let users = [ada, alan];
  let nextId = 3;

  await page.route("**/api/graphql", async (route) => {
    const body = route.request().postDataJSON() as { query: string };

    if (body.query.includes("CreateUser")) {
      const { input } = JSON.parse(
        route.request().postData() ?? "{}",
      ).variables;
      const created = { id: String(nextId++), ...input };
      users = [...users, created];
      return route.fulfill({ json: { data: { createUser: created } } });
    }

    if (body.query.includes("UpdateUser")) {
      const { id, input } = JSON.parse(
        route.request().postData() ?? "{}",
      ).variables;
      const existing = users.find((u) => u.id === id);
      if (!existing) {
        return route.fulfill({ json: { data: { updateUser: null } } });
      }
      const updated = { ...existing, ...input };
      users = users.map((u) => (u.id === id ? updated : u));
      return route.fulfill({ json: { data: { updateUser: updated } } });
    }

    if (body.query.includes("DeleteUser")) {
      const { id } = JSON.parse(route.request().postData() ?? "{}").variables;
      if (!deleteResult) {
        return route.fulfill({ json: { data: { deleteUser: false } } });
      }
      users = users.filter((u) => u.id !== id);
      return route.fulfill({ json: { data: { deleteUser: true } } });
    }

    return route.fulfill({ json: { data: { users } } });
  });
};

test("creates a new user through the inline form", async ({ page }) => {
  await mockGraphql(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: messages.usersList.addUserButton })
    .click();
  await page.getByLabel(messages.userForm.nameLabel).fill("Grace Hopper");
  await page.getByLabel(messages.userForm.emailLabel).fill("grace@example.com");
  await page
    .getByRole("button", { name: messages.userForm.createButton })
    .click();

  await expect(page.getByText("Grace Hopper")).toBeVisible();
});

test("edits an existing user", async ({ page }) => {
  await mockGraphql(page);
  await page.goto("/");

  const adaItem = page.locator("li").first();
  await expect(adaItem).toContainText(ada.email);
  await adaItem
    .getByRole("button", { name: messages.usersList.editButton })
    .click();
  await adaItem
    .getByLabel(messages.userForm.nameLabel)
    .fill("Ada, Countess of Lovelace");
  await adaItem
    .getByRole("button", { name: messages.userForm.saveButton })
    .click();

  await expect(page.getByText("Ada, Countess of Lovelace")).toBeVisible();
});

test("deletes a user after inline confirmation", async ({ page }) => {
  await mockGraphql(page);
  await page.goto("/");

  const adaItem = page.locator("li", { hasText: ada.email });
  await adaItem
    .getByRole("button", { name: messages.usersList.deleteButton })
    .click();
  await expect(page.getByText(messages.usersList.confirmDelete)).toBeVisible();
  await adaItem
    .getByRole("button", { name: messages.usersList.confirmDeleteButton })
    .click();

  await expect(page.getByText(ada.email)).not.toBeVisible();
  await expect(page.getByText(alan.email)).toBeVisible();
});

test("shows a not-found message when deleting an already-removed user", async ({
  page,
}) => {
  await mockGraphql(page, { deleteResult: false });
  await page.goto("/");

  const adaItem = page.locator("li", { hasText: ada.email });
  await adaItem
    .getByRole("button", { name: messages.usersList.deleteButton })
    .click();
  await adaItem
    .getByRole("button", { name: messages.usersList.confirmDeleteButton })
    .click();

  await expect(page.getByText(messages.usersList.deleteNotFound)).toBeVisible();
});
