import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { DeleteButton } from "@/shared/ui/button/DeleteButton.tsx";

afterEach(cleanup);

describe("DeleteButton", () => {
	test("renders an accessible button with the delete tooltip", async () => {
		// when
		render(<DeleteButton onClick={vi.fn()} />);
		const button = screen.getByRole("button", { name: "Delete" });

		// then
		expect(button).toHaveProperty("type", "button");
		fireEvent.mouseOver(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Delete");
	});

	test("calls onClick when clicked", () => {
		// given
		const onClick = vi.fn();
		render(<DeleteButton onClick={onClick} />);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));

		// then
		expect(onClick).toHaveBeenCalledOnce();
	});

	test("does not call onClick when disabled", () => {
		// given
		const onClick = vi.fn();
		render(<DeleteButton onClick={onClick} disabled />);
		const button = screen.getByRole("button", { name: "Delete" });

		// when
		fireEvent.click(button);

		// then
		expect(button).toHaveProperty("disabled", true);
		expect(onClick).not.toHaveBeenCalled();
	});
});
