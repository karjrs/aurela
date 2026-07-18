import dashboard from "@i18n/pl/dashboard.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { Note } from ".";

const { useNoteMock } = vi.hoisted(() => ({
  useNoteMock: vi.fn(),
}));

vi.mock("./hooks", () => ({
  useNote: useNoteMock,
}));

const messages = { dashboard };

const renderWidget = () =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <Note />
    </NextIntlClientProvider>,
  );

describe("Note", () => {
  it("shows the heading and the placeholder when the note is empty", () => {
    useNoteMock.mockReturnValue({ note: "", setNote: vi.fn() });

    renderWidget();

    expect(screen.getByText("Notatka")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Zapisz coś na później…"),
    ).toBeInTheDocument();
  });

  it("renders the current note value", () => {
    useNoteMock.mockReturnValue({ note: "Kupić mleko", setNote: vi.fn() });

    renderWidget();

    expect(screen.getByRole("textbox")).toHaveValue("Kupić mleko");
  });

  it("calls setNote when the text changes", () => {
    const setNote = vi.fn();
    useNoteMock.mockReturnValue({ note: "", setNote });

    renderWidget();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Zadzwonić do mamy" },
    });

    expect(setNote).toHaveBeenCalledWith("Zadzwonić do mamy");
  });
});
