import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import messages from "@/i18n/messages/en.json";
import Home from "./page";

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock("@/graphql/client", () => ({
  graphqlClient: { request: requestMock },
}));

const renderHome = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <Home />
      </NextIntlClientProvider>
    </QueryClientProvider>,
  );
};

describe("Home", () => {
  it("renders the list of users on success", async () => {
    requestMock.mockResolvedValueOnce({
      users: [
        { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
        { id: "2", name: "Alan Turing", email: "alan@example.com" },
      ],
    });

    renderHome();

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    requestMock.mockRejectedValueOnce(new Error("network error"));

    renderHome();

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
