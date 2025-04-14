import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hello } from "./Hello";

describe("Hello", async () => {
  test("Exists", async () => {
    render(<Hello />);

    const hello = screen.getByText("Hello, 0 times");

    expect(hello).toBeDefined();
  });
});
