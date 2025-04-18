import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", async () => {
  test("Exists", async () => {
    const text = "Test";

    render(<Button>{text}</Button>);

    const btn = screen.getByRole("button");

    expect(btn).toBeDefined();
    expect(btn.textContent).toContain(text);
    expect(btn.getAttribute("type")).toBe("button");
  });
  test("Handle other button types", async () => {
    const text = "Test";
    const type = "submit";

    render(<Button type={type}>{text}</Button>);

    const btn = screen.getByRole("button");

    expect(btn).toBeDefined();
    expect(btn.getAttribute("type")).toBe(type);
  });
  test("Handle additional classes", async () => {
    const text = "Test";
    const className = "additional";

    render(<Button className={className}>{text}</Button>);

    const btn = screen.getByRole("button");

    expect(btn).toBeDefined();
    expect(btn.classList).toContain(className);
  });

  test("Calls on click function", () => {
    const text = "Test";
    const spyFn = vi.fn();

    render(<Button onClick={spyFn}>{text}</Button>);

    const btn = screen.getByRole("button");

    expect(spyFn).not.toHaveBeenCalled();

    fireEvent.click(btn);

    expect(spyFn).toHaveBeenCalledOnce();
  });
});
