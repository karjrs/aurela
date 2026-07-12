import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useNote } from ".";

describe("useNote", () => {
  it("starts with an empty note", () => {
    const { result } = renderHook(() => useNote());

    expect(result.current.note).toBe("");
  });

  it("updates the note via setNote", () => {
    const { result } = renderHook(() => useNote());

    act(() => result.current.setNote("Kupić mleko"));

    expect(result.current.note).toBe("Kupić mleko");
  });
});
