import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { SubmitButton } from "@/shared/ui/button/SubmitButton.tsx";

afterEach(cleanup);

describe("SubmitButton", () => {
	test("renders an accessible submit button with the save tooltip", async () => {
		// when
		render(<SubmitButton />);
		const button = screen.getByRole("button", { name: "Save" });

		// then
		expect(button).toHaveProperty("type", "submit");
		fireEvent.mouseOver(button);
		expect((await screen.findByRole("tooltip")).textContent).toBe("Save");
	});

	test("renders a disabled submit button", () => {
		// when
		render(<SubmitButton disabled />);

		// then
		expect(screen.getByRole("button", { name: "Save" })).toHaveProperty(
			"disabled",
			true,
		);
	});
});
