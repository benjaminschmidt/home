import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { ResetButton } from "@/shared/ui/button/ResetButton.tsx";

afterEach(cleanup);

describe("ResetButton", () => {
	test("renders an accessible button with the reset tooltip", async () => {
		// when
		render(<ResetButton onClick={vi.fn()} />);
		const button = screen.getByRole("button", { name: "Reset" });

		// then
		expect(button).toHaveProperty("type", "button");
		fireEvent.mouseOver(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Reset");
	});

	test("calls onClick when clicked", () => {
		// given
		const onClick = vi.fn();
		render(<ResetButton onClick={onClick} />);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));

		// then
		expect(onClick).toHaveBeenCalledOnce();
	});

	test("does not call onClick when disabled", () => {
		// given
		const onClick = vi.fn();
		render(<ResetButton onClick={onClick} disabled />);
		const button = screen.getByRole("button", { name: "Reset" });

		// when
		fireEvent.click(button);

		// then
		expect(button).toHaveProperty("disabled", true);
		expect(onClick).not.toHaveBeenCalled();
	});
});
