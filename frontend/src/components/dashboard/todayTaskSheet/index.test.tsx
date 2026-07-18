import actions from "@i18n/en/actions.json";
import dashboard from "@i18n/en/dashboard.json";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { TaskFormSheet } from ".";
import type { TaskFormValues } from "./types";

const messages = { actions, dashboard };

const renderSheet = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => void;
  initialValues?: TaskFormValues;
}) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <TaskFormSheet {...props} />
    </NextIntlClientProvider>,
  );

describe("TaskFormSheet", () => {
  it("renders nothing when closed", () => {
    renderSheet({ open: false, onOpenChange: vi.fn(), onSubmit: vi.fn() });

    expect(screen.queryByText("New task")).not.toBeInTheDocument();
  });

  it("renders the form when open", () => {
    renderSheet({ open: true, onOpenChange: vi.fn(), onSubmit: vi.fn() });

    expect(screen.getByText("New task")).toBeInTheDocument();
    expect(screen.getByLabelText("Task name")).toBeInTheDocument();
    expect(screen.getByLabelText("Start time")).toBeInTheDocument();
    expect(screen.getByLabelText("Duration")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) without submitting when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSubmit = vi.fn();
    renderSheet({ open: true, onOpenChange, onSubmit });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onOpenChange(false) when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderSheet({ open: true, onOpenChange, onSubmit: vi.fn() });

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not submit when the title is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderSheet({ open: true, onOpenChange: vi.fn(), onSubmit });

    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered values and closes the sheet", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSubmit = vi.fn();
    renderSheet({ open: true, onOpenChange, onSubmit });

    await user.type(screen.getByLabelText("Task name"), "Morning walk");
    await user.click(screen.getByRole("radio", { name: "🎯" }));
    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Morning walk", emoji: "🎯" }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("updates the emoji preview and checked state when a chip is selected", async () => {
    const user = userEvent.setup();
    renderSheet({ open: true, onOpenChange: vi.fn(), onSubmit: vi.fn() });

    const target = screen.getByRole("radio", { name: "🚶" });
    await user.click(target);

    expect(target).toHaveAttribute("aria-checked", "true");
  });
});
