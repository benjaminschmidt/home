import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { SaveButton } from "@/shared/ui/button/SaveButton.tsx";

afterEach(cleanup);

describe("SaveButton", () => {
	test("renders an accessible submit button with the save tooltip", async () => {
		// when
		render(<SaveButton />);
		const button = screen.getByRole("button", { name: "Save" });

		// then
		expect(button).toHaveProperty("type", "submit");
		fireEvent.mouseOver(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Save");
	});

	test("renders a disabled submit button", () => {
		// when
		render(<SaveButton disabled />);

		// then
		expect(screen.getByRole("button", { name: "Save" })).toHaveProperty(
			"disabled",
			true,
		);
	});
});
