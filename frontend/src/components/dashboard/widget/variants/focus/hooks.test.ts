import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BREAK_DURATION_SECONDS, WORK_DURATION_SECONDS } from "./consts";
import { useFocus } from "./hooks";

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useFocus", () => {
  it("starts paused in the work phase with the full work duration", () => {
    const { result } = renderHook(() => useFocus());

    expect(result.current.phase).toBe("work");
    expect(result.current.secondsRemaining).toBe(WORK_DURATION_SECONDS);
    expect(result.current.isRunning).toBe(false);
  });

  it("counts down one second per tick once toggled on", () => {
    const { result } = renderHook(() => useFocus());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));

    expect(result.current.secondsRemaining).toBe(WORK_DURATION_SECONDS - 3);
    expect(result.current.isRunning).toBe(true);
  });

  it("does not count down while paused", () => {
    const { result } = renderHook(() => useFocus());

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current.secondsRemaining).toBe(WORK_DURATION_SECONDS);
  });

  it("switches to the break phase and stops when work reaches zero", () => {
    const { result } = renderHook(() => useFocus());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(WORK_DURATION_SECONDS * 1000));

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(BREAK_DURATION_SECONDS);
    expect(result.current.isRunning).toBe(false);
  });

  it("resets to the full duration of the current phase and pauses", () => {
    const { result } = renderHook(() => useFocus());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.reset());

    expect(result.current.secondsRemaining).toBe(WORK_DURATION_SECONDS);
    expect(result.current.isRunning).toBe(false);
  });

  it("skipPhase switches to break with its full duration while paused", () => {
    const { result } = renderHook(() => useFocus());

    act(() => result.current.skipPhase());

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(BREAK_DURATION_SECONDS);
    expect(result.current.isRunning).toBe(false);
  });

  it("skipPhase keeps running when the timer was already running", () => {
    const { result } = renderHook(() => useFocus());

    act(() => result.current.toggle());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.skipPhase());

    expect(result.current.phase).toBe("break");
    expect(result.current.secondsRemaining).toBe(BREAK_DURATION_SECONDS);
    expect(result.current.isRunning).toBe(true);
  });

  it("skipPhase toggles back to work from break", () => {
    const { result } = renderHook(() => useFocus());

    act(() => result.current.skipPhase());
    act(() => result.current.skipPhase());

    expect(result.current.phase).toBe("work");
    expect(result.current.secondsRemaining).toBe(WORK_DURATION_SECONDS);
  });
});
