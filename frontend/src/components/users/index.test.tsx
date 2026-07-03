import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";

import { UsersList } from "./list";

import {
  CreateUserDocument,
  DeleteUserDocument,
  GetUsersDocument,
  UpdateUserDocument,
} from "@/graphql/types";
import messages from "@/i18n/messages/en.json";

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock("@/graphql/client", () => ({
  graphqlClient: { request: requestMock },
}));

const ada = { id: "1", name: "Ada Lovelace", email: "ada@example.com" };
const alan = { id: "2", name: "Alan Turing", email: "alan@example.com" };

const renderUsersList = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <UsersList />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  requestMock.mockReset();
});

describe("creating a user", () => {
  it("adds the new user to the list on success", async () => {
    const user = userEvent.setup();
    let users = [ada, alan];
    const grace = { id: "3", name: "Grace Hopper", email: "grace@example.com" };

    requestMock.mockImplementation((document) => {
      if (document === GetUsersDocument) return Promise.resolve({ users });
      if (document === CreateUserDocument) {
        users = [...users, grace];
        return Promise.resolve({ createUser: grace });
      }
      throw new Error(`Unexpected document in test: ${JSON.stringify(document)}`);
    });

    renderUsersList();
    await user.click(await screen.findByRole("button", { name: "Add user" }));
    await user.type(screen.getByLabelText("Name"), grace.name);
    await user.type(screen.getByLabelText("Email"), grace.email);
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
  });

  it("shows validation errors and never calls the mutation for an empty form", async () => {
    const user = userEvent.setup();
    requestMock.mockImplementation((document) => {
      if (document === GetUsersDocument) return Promise.resolve({ users: [ada, alan] });
      throw new Error(`Unexpected document in test: ${JSON.stringify(document)}`);
    });

    renderUsersList();
    await user.click(await screen.findByRole("button", { name: "Add user" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalledWith(
      CreateUserDocument,
      expect.anything(),
    );
  });
});

describe("editing a user", () => {
  it("updates the user shown in the list on success", async () => {
    const user = userEvent.setup();
    let users = [ada, alan];
    const updated = { ...ada, name: "Ada, Countess of Lovelace" };

    requestMock.mockImplementation((document) => {
      if (document === GetUsersDocument) return Promise.resolve({ users });
      if (document === UpdateUserDocument) {
        users = users.map((u) => (u.id === ada.id ? updated : u));
        return Promise.resolve({ updateUser: updated });
      }
      throw new Error(`Unexpected document in test: ${JSON.stringify(document)}`);
    });

    renderUsersList();
    const adaItem = (
      await screen.findByText("Ada Lovelace")
    ).closest("li") as HTMLElement;
    await user.click(within(adaItem).getByRole("button", { name: "Edit" }));

    const nameInput = within(adaItem).getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, updated.name);
    await user.click(within(adaItem).getByRole("button", { name: "Save" }));

    expect(await screen.findByText(updated.name)).toBeInTheDocument();
  });

  it("shows a not-found message when the user no longer exists", async () => {
    const user = userEvent.setup();
    requestMock.mockImplementation((document) => {
      if (document === GetUsersDocument) return Promise.resolve({ users: [ada, alan] });
      if (document === UpdateUserDocument) return Promise.resolve({ updateUser: null });
      throw new Error(`Unexpected document in test: ${JSON.stringify(document)}`);
    });

    renderUsersList();
    const adaItem = (
      await screen.findByText("Ada Lovelace")
    ).closest("li") as HTMLElement;
    await user.click(within(adaItem).getByRole("button", { name: "Edit" }));
    await user.click(within(adaItem).getByRole("button", { name: "Save" }));

    expect(
      await within(adaItem).findByText(
        "This user no longer exists. The list has been refreshed.",
      ),
    ).toBeInTheDocument();
  });
});

describe("deleting a user", () => {
  it("removes the user from the list after confirming", async () => {
    const user = userEvent.setup();
    let users = [ada, alan];

    requestMock.mockImplementation((document) => {
      if (document === GetUsersDocument) return Promise.resolve({ users });
      if (document === DeleteUserDocument) {
        users = users.filter((u) => u.id !== ada.id);
        return Promise.resolve({ deleteUser: true });
      }
      throw new Error(`Unexpected document in test: ${JSON.stringify(document)}`);
    });

    renderUsersList();
    const adaItem = (
      await screen.findByText("Ada Lovelace")
    ).closest("li") as HTMLElement;
    await user.click(within(adaItem).getByRole("button", { name: "Delete" }));
    await user.click(within(adaItem).getByRole("button", { name: "Confirm" }));

    await screen.findByText("Alan Turing");
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("shows a not-found message when the user was already removed", async () => {
    const user = userEvent.setup();
    requestMock.mockImplementation((document) => {
      if (document === GetUsersDocument) return Promise.resolve({ users: [ada, alan] });
      if (document === DeleteUserDocument) return Promise.resolve({ deleteUser: false });
      throw new Error(`Unexpected document in test: ${JSON.stringify(document)}`);
    });

    renderUsersList();
    const adaItem = (
      await screen.findByText("Ada Lovelace")
    ).closest("li") as HTMLElement;
    await user.click(within(adaItem).getByRole("button", { name: "Delete" }));
    await user.click(within(adaItem).getByRole("button", { name: "Confirm" }));

    expect(
      await within(adaItem).findByText(
        "This user was already removed. The list has been refreshed.",
      ),
    ).toBeInTheDocument();
  });
});
