import { describe, expect, test } from "vitest";
import {
	createIngredientFormDefaultValues,
	toIngredientWriteRequest,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";

describe("ingredient form model", () => {
	test("creates blank defaults without a conversion or default variant", () => {
		// when
		const defaults = createIngredientFormDefaultValues();

		// then
		expect(defaults).toMatchObject({
			name: "",
			weightAmount: "",
			volumeAmount: "",
			defaultVariantId: "",
		});
	});

	test("creates defaults from a stored conversion", () => {
		// when
		const defaults = createIngredientFormDefaultValues(
			{
				name: "Flour",
				weightToVolumeConversionFactor: 2.5,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			},
			"550e8400-e29b-41d4-a716-446655440000",
		);

		// then
		expect(defaults).toEqual({
			name: "Flour",
			weightAmount: "1",
			weightUnit: "GRAM",
			volumeAmount: "2.5",
			volumeUnit: "MILLILITER",
			defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
		});
	});

	test("maps an unset conversion and no default variant to the write request", () => {
		// when
		const writeRequest = toIngredientWriteRequest({
			...createIngredientFormDefaultValues(),
			name: "  Flour ",
		});

		// then
		expect(writeRequest).toEqual({
			name: "Flour",
			weightToVolumeConversionFactor: undefined,
			conversionWeightUnit: undefined,
			conversionVolumeUnit: undefined,
			defaultVariantId: undefined,
		});
	});

	test("maps conversion amounts and the selected default variant to the write request", () => {
		// when
		const writeRequest = toIngredientWriteRequest({
			...createIngredientFormDefaultValues(),
			name: "Flour",
			weightAmount: "2",
			volumeAmount: "5",
			defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
		});

		// then
		expect(writeRequest).toEqual({
			name: "Flour",
			weightToVolumeConversionFactor: 2.5,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
			defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
		});
	});
});
