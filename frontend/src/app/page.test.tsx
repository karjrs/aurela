import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the hero heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /your day, quietly planned/i }),
    ).toBeInTheDocument();
  });

  it("renders a get started call to action", () => {
    render(<Home />);
    expect(
      screen.getAllByRole("button", { name: /get started/i }),
    ).toHaveLength(2);
  });
});
