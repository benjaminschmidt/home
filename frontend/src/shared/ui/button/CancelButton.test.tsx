import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { CancelButton } from "@/shared/ui/button/CancelButton.tsx";

afterEach(cleanup);

describe("CancelButton", () => {
	test("renders an accessible button with the cancel tooltip", async () => {
		// when
		render(<CancelButton onClick={vi.fn()} />);
		const button = screen.getByRole("button", { name: "Cancel" });

		// then
		expect(button).toHaveProperty("type", "button");
		fireEvent.mouseOver(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Cancel");
	});

	test("calls onClick when clicked", () => {
		// given
		const onClick = vi.fn();
		render(<CancelButton onClick={onClick} />);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

		// then
		expect(onClick).toHaveBeenCalledOnce();
	});

	test("does not call onClick when disabled", () => {
		// given
		const onClick = vi.fn();
		render(<CancelButton onClick={onClick} disabled />);
		const button = screen.getByRole("button", { name: "Cancel" });

		// when
		fireEvent.click(button);

		// then
		expect(button).toHaveProperty("disabled", true);
		expect(onClick).not.toHaveBeenCalled();
	});
});
