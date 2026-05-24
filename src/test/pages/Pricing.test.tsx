import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Pricing from "../../pages/Pricing";

function renderPricing() {
  return render(
    <MemoryRouter>
      <Pricing />
    </MemoryRouter>,
  );
}

describe("Pricing", () => {
  it("renders all four plan tiers", () => {
    renderPricing();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("3 Months")).toBeInTheDocument();
    expect(screen.getByText("6 Months")).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
  });

  it("displays correct prices", () => {
    renderPricing();
    expect(screen.getByText("$7.99/mo")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("$34.99")).toBeInTheDocument();
    expect(screen.getByText("$50/yr")).toBeInTheDocument();
  });

  it("renders a Get Started button for each plan", () => {
    renderPricing();
    const buttons = screen.getAllByText("Get Started");
    expect(buttons).toHaveLength(4);
  });

  it("renders the features list", () => {
    renderPricing();
    expect(screen.getByText(/Confidence-graded props/)).toBeInTheDocument();
    expect(screen.getByText(/Full analytics dashboard/)).toBeInTheDocument();
  });
});
