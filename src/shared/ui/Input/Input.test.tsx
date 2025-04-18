import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", async () => {
  test("Exists", () => {
    const wrapper = render(<Input />);

    expect(wrapper).toBeTruthy();

    const input = screen.getByRole("textbox");

    expect(input).toBeTruthy();
    expect(input.classList).not.toContain("border-red-600");
  });

  test("Has error style and text", () => {
    const text = "Test error";

    render(<Input error={text} touched />);

    const input = screen.getByRole("textbox");
    const errorText = screen.getByText(text);

    expect(input.classList).toContain("border-red-600");
    expect(errorText).toBeTruthy();
  });

  test("Has success style", () => {
    render(<Input touched />);

    const input = screen.getByRole("textbox");

    expect(input.classList).toContain("border-teal-500");
  });
});
