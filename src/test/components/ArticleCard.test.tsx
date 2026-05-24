import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArticleCard from "../../components/article/ArticleCard";
import type { ArticleListItem } from "../../types/articles";

const base: ArticleListItem = {
  id: "1",
  title: "Test Article",
  subtitle: "A subtitle",
  body: "<p>Hello <strong>world</strong></p>",
  published_at: "2025-01-15T00:00:00Z",
  sport: "nba",
  author: { id: "a1", display_name: "Jane Doe" },
};

function renderCard(overrides: Partial<ArticleListItem> = {}) {
  return render(
    <MemoryRouter>
      <ArticleCard article={{ ...base, ...overrides }} />
    </MemoryRouter>,
  );
}

describe("ArticleCard", () => {
  it("renders title and author", () => {
    renderCard();
    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("strips HTML tags from body preview", () => {
    renderCard();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.queryByText(/<p>/)).not.toBeInTheDocument();
  });

  it("does not crash when body is null", () => {
    expect(() => renderCard({ body: null })).not.toThrow();
  });

  it("does not crash when body is undefined", () => {
    expect(() => renderCard({ body: undefined })).not.toThrow();
  });

  it("shows Draft when published_at is missing", () => {
    renderCard({ published_at: null });
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("shows sport in uppercase", () => {
    renderCard();
    expect(screen.getByText("NBA")).toBeInTheDocument();
  });

  it("falls back to Unknown when author has no display_name", () => {
    renderCard({ author: { id: "a2", display_name: null } });
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
