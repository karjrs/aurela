import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFocusTimer } from ".";

vi.mock("./playChime", () => ({ playChime: vi.fn() }));

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useFocusTimer", () => {
  it("starts paused in the work phase with the full work duration", () => {
    const { result } = renderHook(() => useFocusTimer());

    expect(result.current.phase).toBe("work");
    expect(result.current.secondsRemaining).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  it("counts down one second per tick once toggled on", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.secondsRemaining).toBe(25 * 60 - 3);
    expect(result.current.isRunning).toBe(true);
  });

  it("does not count down while paused", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current.secondsRemaining).toBe(25 * 60);
  });

  it("switches to the break phase and keeps running when work reaches zero", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(25 * 60 * 1000));

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(5 * 60);
    expect(result.current.isRunning).toBe(true);
  });

  it("plays a chime when a phase ends", async () => {
    const { playChime } = await import("./playChime");
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(25 * 60 * 1000));

    expect(playChime).toHaveBeenCalledTimes(1);
  });

  it("resets to the full duration of the current phase and pauses", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.reset());

    expect(result.current.secondsRemaining).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  it("skipPhase switches to break with its full duration while paused", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.skipPhase());

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(5 * 60);
    expect(result.current.isRunning).toBe(false);
  });

  it("skipPhase keeps running when the timer was already running", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.skipPhase());

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(5 * 60);
    expect(result.current.isRunning).toBe(true);
  });

  it("skipPhase toggles back to work from break", () => {
    const { result } = renderHook(() => useFocusTimer());

    act(() => result.current.skipPhase());
    act(() => result.current.skipPhase());

    expect(result.current.phase).toBe("work");
    expect(result.current.secondsRemaining).toBe(25 * 60);
  });
});
