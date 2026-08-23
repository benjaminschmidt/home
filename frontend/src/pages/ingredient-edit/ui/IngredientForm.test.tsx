import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { IngredientVariantDto } from "home-api";
import { afterEach, describe, expect, test } from "vitest";
import {
	createIngredientFormDefaultValues,
	useAppForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientForm } from "@/pages/ingredient-edit/ui/IngredientForm.tsx";
import { ingredientVariantFactory } from "@/shared/testing";

afterEach(cleanup);

type IngredientFormTestHostProps = {
	initialValues?: {
		name?: string;
		weightToVolumeConversionFactor?: number;
		conversionWeightUnit?:
			| "GRAM"
			| "MILLIGRAM"
			| "KILOGRAM"
			| "OUNCE"
			| "POUND";
		conversionVolumeUnit?:
			| "MILLILITER"
			| "LITER"
			| "FLUID_OUNCE"
			| "TEASPOON"
			| "TABLESPOON"
			| "CUP";
	};
	variants?: IngredientVariantDto[];
	defaultVariantId?: string;
};

const IngredientFormTestHost = ({
	initialValues,
	variants = [],
	defaultVariantId,
}: IngredientFormTestHostProps) => {
	const form = useAppForm({
		defaultValues: createIngredientFormDefaultValues(
			initialValues,
			defaultVariantId,
		),
		validators: {
			onChange: ingredientFormSchema,
		},
	});

	return (
		<form>
			<IngredientForm form={form} variants={variants} />
		</form>
	);
};

describe("IngredientForm", () => {
	test("renders a blank form when there are no initial values", () => {
		// when
		render(<IngredientFormTestHost />);

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "");
		expect(screen.getByLabelText("Weight amount")).toHaveProperty("value", "");
		expect(screen.getByLabelText("Volume amount")).toHaveProperty("value", "");
		expect(screen.getByText("Weight ↔ volume conversion")).toBeTruthy();
		expect(screen.getByText("Ingredient")).toBeTruthy();
		const defaultVariantSelector = screen.getByRole("combobox", {
			name: "Default variant",
		});
		expect(defaultVariantSelector.textContent).not.toContain("None");
		fireEvent.mouseDown(defaultVariantSelector);
		expect(screen.getByRole("option", { name: "None" })).toBeTruthy();
	});

	test("prefills name and conversion fields from initial values", () => {
		// when
		render(
			<IngredientFormTestHost
				initialValues={{
					name: "Flour",
					weightToVolumeConversionFactor: 2.5,
					conversionWeightUnit: "GRAM",
					conversionVolumeUnit: "MILLILITER",
				}}
			/>,
		);

		// then
		expect(screen.getByLabelText("Name")).toHaveProperty("value", "Flour");
		expect(screen.getByLabelText("Weight amount")).toHaveProperty("value", "1");
		expect(screen.getByLabelText("Volume amount")).toHaveProperty(
			"value",
			"2.5",
		);
		expect(
			screen.getByRole("combobox", { name: "Weight unit" }).textContent,
		).toBe("g");
		expect(
			screen.getByRole("combobox", { name: "Volume unit" }).textContent,
		).toBe("ml");
	});

	test("renders a default variant selector with None without variants", () => {
		// when
		render(<IngredientFormTestHost variants={[]} />);

		// then
		const defaultVariantSelector = screen.getByRole("combobox", {
			name: "Default variant",
		});
		expect(defaultVariantSelector.textContent).not.toContain("None");
		fireEvent.mouseDown(defaultVariantSelector);
		expect(screen.getByRole("option", { name: "None" })).toBeTruthy();
	});

	test("renders default variant options plus none, preselecting the current default", () => {
		// given
		const wholeVariant = ingredientVariantFactory.build({
			description: "Whole",
		});
		const slicedVariant = ingredientVariantFactory.build({
			description: "Sliced",
		});
		const variants = [wholeVariant, slicedVariant];

		// when
		render(
			<IngredientFormTestHost
				variants={variants}
				defaultVariantId={slicedVariant.id}
			/>,
		);

		// then
		expect(
			screen.getByRole("combobox", { name: "Default variant" }).textContent,
		).toBe("Sliced");
		fireEvent.mouseDown(
			screen.getByRole("combobox", { name: "Default variant" }),
		);
		expect(screen.getByRole("option", { name: "None" })).toBeTruthy();
		expect(screen.getByRole("option", { name: "Whole" })).toBeTruthy();
		expect(screen.getByRole("option", { name: "Sliced" })).toBeTruthy();
	});

	test("shows a validation error when the name is empty", () => {
		// given
		render(<IngredientFormTestHost />);

		// when
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "  " },
		});

		// then
		expect(screen.getByText("Name is required")).toBeTruthy();
	});

	test("requires both conversion amounts or neither", () => {
		// given
		render(<IngredientFormTestHost />);
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Flour" },
		});

		// when
		fireEvent.change(screen.getByLabelText("Weight amount"), {
			target: { value: "1" },
		});

		// then
		expect(
			screen.getByText("Both amounts are required to set a conversion"),
		).toBeTruthy();
	});
});
