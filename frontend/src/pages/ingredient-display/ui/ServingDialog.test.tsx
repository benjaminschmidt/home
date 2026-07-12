import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { Ingredient } from "@/entities/ingredients";
import { ServingDialog } from "@/pages/ingredient-display/ui/ServingDialog.tsx";

afterEach(cleanup);

const ingredient: Ingredient = {
	name: "ingredient",
	defaultUnit: "GRAM",
	customUnits: [],
};

describe("ServingDialog", () => {
	test("renders amount, unit selector, and actions", () => {
		// when
		render(
			<ServingDialog
				ingredient={{
					...ingredient,
					customUnits: [
						{
							name: "slice",
							customUnitToConversionUnitFactor: 30,
							conversionUnit: "GRAM",
						},
					],
				}}
				servingSize={100}
				unit="GRAM"
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// then
		expect(screen.getByLabelText("Amount")).toBeTruthy();
		expect(screen.getByRole("combobox", { name: "Unit" })).toBeTruthy();
		expect(
			screen
				.getByRole("combobox", { name: "Unit" })
				.compareDocumentPosition(screen.getByLabelText("Amount")) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(screen.getByRole("button", { name: "Reset" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
	});

	test("shows ingredient custom units by name", () => {
		// given
		render(
			<ServingDialog
				ingredient={{
					...ingredient,
					customUnits: [
						{
							name: "slice",
							customUnitToConversionUnitFactor: 30,
							conversionUnit: "GRAM",
						},
					],
				}}
				servingSize={1}
				unit="slice"
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// when
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));

		// then
		expect(screen.getByRole("option", { name: "slice" })).toBeTruthy();
	});

	test("converts the amount when selecting another unit", () => {
		// given
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// when
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));
		fireEvent.click(screen.getByRole("option", { name: "kg" }));

		// then
		expect(screen.getByLabelText("Amount")).toHaveProperty("value", "0.1");
	});

	test("keeps an empty amount when selecting another unit", () => {
		// given
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "" },
		});
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));
		fireEvent.click(screen.getByRole("option", { name: "kg" }));

		// then
		expect(screen.getByLabelText("Amount")).toHaveProperty("value", "");
	});

	test("keeps an invalid amount when selecting another unit", () => {
		// given
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={vi.fn()}
				onApply={vi.fn()}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "abc" },
		});
		fireEvent.mouseDown(screen.getByRole("combobox", { name: "Unit" }));
		fireEvent.click(screen.getByRole("option", { name: "kg" }));

		// then
		expect(screen.getByLabelText("Amount")).toHaveProperty("value", "abc");
		expect(
			screen.getByText("Amount must be a number greater than 0"),
		).toBeTruthy();
	});

	test("applies the selected serving draft and closes", () => {
		// given
		const onClose = vi.fn();
		const onApply = vi.fn();
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={onClose}
				onApply={onApply}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "250" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));

		// then
		expect(onApply).toHaveBeenCalledWith({ servingSize: 250, unit: "GRAM" });
		expect(onClose).toHaveBeenCalledOnce();
	});

	test("applies an empty serving draft as undefined", () => {
		// given
		const onClose = vi.fn();
		const onApply = vi.fn();
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={onClose}
				onApply={onApply}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));

		// then
		expect(onApply).toHaveBeenCalledWith({
			servingSize: undefined,
			unit: "GRAM",
		});
		expect(onClose).toHaveBeenCalledOnce();
	});

	test("does not apply a non-positive serving draft", () => {
		// given
		const onClose = vi.fn();
		const onApply = vi.fn();
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={onClose}
				onApply={onApply}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "0" },
		});

		// then
		expect(
			screen.getByText("Amount must be a number greater than 0"),
		).toBeTruthy();
		expect(screen.getByRole("button", { name: "Apply" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(onApply).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});

	test("does not apply a non-numeric serving draft", () => {
		// given
		const onClose = vi.fn();
		const onApply = vi.fn();
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={onClose}
				onApply={onApply}
			/>,
		);

		// when
		fireEvent.change(screen.getByLabelText("Amount"), {
			target: { value: "abc" },
		});

		// then
		expect(
			screen.getByText("Amount must be a number greater than 0"),
		).toBeTruthy();
		expect(screen.getByRole("button", { name: "Apply" })).toHaveProperty(
			"disabled",
			true,
		);
		expect(onApply).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});

	test("resets serving to variant defaults and closes", () => {
		// given
		const onClose = vi.fn();
		const onApply = vi.fn();
		render(
			<ServingDialog
				ingredient={ingredient}
				servingSize={100}
				unit="GRAM"
				onClose={onClose}
				onApply={onApply}
			/>,
		);

		// when
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));

		// then
		expect(onApply).toHaveBeenCalledWith({
			servingSize: undefined,
			unit: undefined,
		});
		expect(onClose).toHaveBeenCalledOnce();
	});
});
