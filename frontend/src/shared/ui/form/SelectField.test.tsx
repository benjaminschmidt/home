import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
	SelectField,
	type SelectFieldItem,
} from "@/shared/ui/form/SelectField.tsx";

afterEach(cleanup);

describe("SelectField", () => {
	test("renders the label and selected value", () => {
		// when
		render(
			<SelectField
				label="Unit"
				value="GRAM"
				handleChange={vi.fn()}
				items={[
					{ type: "option", key: "gram", value: "GRAM", label: "g" },
					{ type: "option", key: "kg", value: "KILOGRAM", label: "kg" },
				]}
			/>,
		);

		// then
		const select = screen.getByRole("combobox", { name: "Unit" });
		const label = screen.getByText("Unit", { selector: "label" });
		expect(select.textContent).toBe("g");
		expect(select.getAttribute("aria-labelledby")).toBe(label.id);
	});

	test("passes the selected value to handleChange", () => {
		// given
		const handleChange = vi.fn();
		render(
			<SelectField
				label="Unit"
				value="GRAM"
				handleChange={handleChange}
				items={[
					{ type: "option", key: "gram", value: "GRAM", label: "g" },
					{ type: "option", key: "kg", value: "KILOGRAM", label: "kg" },
				]}
			/>,
		);

		// when
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));
		fireEvent.click(screen.getByRole("option", { name: "kg" }));

		// then
		expect(handleChange).toHaveBeenCalledWith("KILOGRAM");
	});

	test("renders item options", () => {
		// when
		render(
			<SelectField
				label="Variant"
				value="whole"
				handleChange={vi.fn()}
				items={[
					{ type: "option", key: "whole", value: "whole", label: "Whole" },
				]}
			/>,
		);

		// then
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Variant" }));
		expect(screen.getByRole("option", { name: "Whole" })).toBeTruthy();
	});

	test("renders group markers and their options", () => {
		// given
		const items: SelectFieldItem[] = [
			{ type: "group", key: "weight", label: "Weight" },
			{ type: "option", key: "gram", value: "GRAM", label: "g" },
		];

		// when
		render(
			<SelectField
				label="Unit"
				value="GRAM"
				handleChange={vi.fn()}
				items={items}
			/>,
		);

		// then
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));
		expect(screen.getByText("Weight")).toBeTruthy();
		expect(screen.getByRole("option", { name: "g" })).toBeTruthy();
	});
});
