import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { NotesPrompt } from "@/components/dashboard/notes-prompt";
import type { LearningChapter } from "@/types";

// The component fetches its own chapters, so the service is the seam.
const getMyChapters = vi.fn();
vi.mock("@/services/journey.service", () => ({
  getMyChapters: () => getMyChapters(),
}));

function chapter(order: number, isRead: boolean): LearningChapter {
  return {
    id: `chapter-${order}`,
    domain_id: "domain-1",
    title: `Chapter ${order}`,
    summary: null,
    order_number: order,
    difficulty: "beginner",
    pdf_url: "chapters/x.pdf",
    pdf_filename: "x.pdf",
    pdf_size_bytes: 1024,
    estimated_minutes: 20,
    status: "active",
    is_read: isRead,
    updated_by: null,
    updated_by_name: "",
  } as LearningChapter;
}

async function renderPrompt(chapters: LearningChapter[]) {
  getMyChapters.mockResolvedValue(chapters);

  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  render(
    <QueryClientProvider client={client}>
      <NotesPrompt />
    </QueryClientProvider>,
  );

  // The query resolves on a microtask; without waiting we assert on the
  // loading render and every test passes for the wrong reason.
  await screen.findByRole("link", { name: /notes/i }).catch(() => null);
}

/**
 * The prompt that tells students to read the notes first.
 *
 * The behaviour that matters is what it does *not* do: it never blocks, and it
 * never appears when there is nothing to read. A domain whose material is still
 * being written must not show students a promise of notes that do not exist.
 */
describe("NotesPrompt", () => {
  it("renders nothing when the domain has no chapters", async () => {
    getMyChapters.mockResolvedValue([]);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    const { container } = render(
      <QueryClientProvider client={client}>
        <NotesPrompt />
      </QueryClientProvider>,
    );

    // Nothing at all — not an empty card, not a spinner left behind.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container.querySelector("a")).toBeNull();
  });

  it("asks the student to read them when none are read", async () => {
    await renderPrompt([chapter(1, false), chapter(2, false)]);

    expect(await screen.findByText(/before you start/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open study notes/i })).toHaveAttribute(
      "href",
      "/dashboard/notes",
    );
  });

  it("reports partial progress rather than starting from zero", async () => {
    await renderPrompt([chapter(1, true), chapter(2, false), chapter(3, false)]);

    expect(await screen.findByText(/you've read 1 so far/i)).toBeInTheDocument();
  });

  it("congratulates rather than nags once everything is read", async () => {
    await renderPrompt([chapter(1, true), chapter(2, true)]);

    expect(
      await screen.findByText(/worked through all the notes/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/before you start/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /revisit notes/i }),
    ).toBeInTheDocument();
  });

  it("never renders anything that blocks the page", async () => {
    await renderPrompt([chapter(1, false)]);

    // The notes are a prompt, not a gate. A button that disables the tasks, or
    // an overlay, would be the failure this asserts against.
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
