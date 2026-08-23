import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { TextField } from "@/shared/ui/form/TextField.tsx";

afterEach(cleanup);

describe("TextField", () => {
	test("renders the label and value", () => {
		// when
		render(
			<TextField
				label="Ingredient name"
				value="Flour"
				handleChange={vi.fn()}
			/>,
		);

		// then
		const input = screen.getByLabelText("Ingredient name");
		expect(
			Array.from(document.querySelectorAll("label")).find(
				(label) => label.htmlFor === input.id,
			),
		).toBeTruthy();
		expect(input).toHaveProperty("value", "Flour");
	});

	test("passes the changed value to handleChange", () => {
		// given
		const handleChange = vi.fn();
		render(
			<TextField label="Name" value="Flour" handleChange={handleChange} />,
		);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Bread" },
		});

		// then
		expect(handleChange).toHaveBeenCalledWith("Bread");
	});

	test("renders the validation error message", () => {
		// when
		render(
			<TextField
				label="Name"
				value="  "
				handleChange={vi.fn()}
				errorMessage="Name is required"
			/>,
		);

		// then
		expect(screen.getByText("Name is required")).toBeTruthy();
	});
});
