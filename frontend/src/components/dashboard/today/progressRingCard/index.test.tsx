import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressRingCard } from ".";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

describe("ProgressRingCard", () => {
  it("renders the total and label inside the ring", () => {
    const { container } = render(
      <ProgressRingCard total={4} completed={2} label="plany" />,
    );

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("plany")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("leaves the ring unfilled when total is 0", () => {
    const { container } = render(
      <ProgressRingCard total={0} completed={0} label="planów" />,
    );

    const progressCircle = container.querySelectorAll("circle")[1];
    expect(progressCircle).toHaveAttribute(
      "stroke-dashoffset",
      String(CIRCUMFERENCE),
    );
  });

  it("fully fills the ring when completed equals total", () => {
    const { container } = render(
      <ProgressRingCard total={3} completed={3} label="plany" />,
    );

    const progressCircle = container.querySelectorAll("circle")[1];
    expect(progressCircle).toHaveAttribute("stroke-dashoffset", "0");
  });

  it("exposes an accessible label combining the total and label", () => {
    render(<ProgressRingCard total={5} completed={2} label="planów" />);

    expect(screen.getByRole("img", { name: "5 planów" })).toBeInTheDocument();
  });
});
