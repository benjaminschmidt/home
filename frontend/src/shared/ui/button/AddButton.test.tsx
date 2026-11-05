import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { AddButton } from "@/shared/ui/button/AddButton.tsx";

afterEach(cleanup);

describe("AddButton", () => {
	test("renders an accessible button with the add tooltip", async () => {
		// when
		render(<AddButton onClick={vi.fn()} />);
		const button = screen.getByRole("button", { name: "Add" });

		// then
		expect(button).toHaveProperty("type", "button");
		fireEvent.mouseOver(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Add");
	});

	test("calls onClick when clicked", () => {
		// given
		const onClick = vi.fn();
		render(<AddButton label="Add variant" onClick={onClick} />);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Add variant" }));

		// then
		expect(onClick).toHaveBeenCalledOnce();
	});

	test("does not call onClick when disabled", () => {
		// given
		const onClick = vi.fn();
		render(<AddButton onClick={onClick} disabled />);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Add" }));

		// then
		expect(onClick).not.toHaveBeenCalled();
	});
});
