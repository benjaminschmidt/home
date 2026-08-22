import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { IngredientTextInputField } from "@/pages/ingredient-edit/ui/IngredientTextInputField.tsx";

afterEach(cleanup);

describe("IngredientTextInputField", () => {
	test("renders the label and value", () => {
		// when
		render(
			<IngredientTextInputField
				label="Ingredient name"
				value="Flour"
				handleChange={vi.fn()}
			/>,
		);

		// then
		expect(screen.getByText("Ingredient name")).toBeTruthy();
		expect(screen.getByLabelText("Ingredient name")).toHaveProperty(
			"value",
			"Flour",
		);
	});

	test("passes the changed value to handleChange", () => {
		// given
		const handleChange = vi.fn();
		render(
			<IngredientTextInputField
				label="Name"
				value="Flour"
				handleChange={handleChange}
			/>,
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
			<IngredientTextInputField
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
