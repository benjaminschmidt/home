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
				conversionWeightAmount: 4,
				conversionVolumeAmount: 10,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			},
			"550e8400-e29b-41d4-a716-446655440000",
		);

		// then
		expect(defaults).toEqual({
			name: "Flour",
			weightAmount: "4",
			weightUnit: "GRAM",
			volumeAmount: "10",
			volumeUnit: "MILLILITER",
			defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
		});
	});

	test("retains stored amount precision in the form draft", () => {
		const weightAmount = 0.1234567890123456;
		const volumeAmount = 0.009876543210987654;

		const defaults = createIngredientFormDefaultValues({
			conversionWeightAmount: weightAmount,
			conversionVolumeAmount: volumeAmount,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
		});

		expect(defaults.weightAmount).toBe(String(weightAmount));
		expect(defaults.volumeAmount).toBe(String(volumeAmount));
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
			conversionWeightAmount: undefined,
			conversionVolumeAmount: undefined,
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
			conversionWeightAmount: 2,
			conversionVolumeAmount: 5,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
			defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
		});
	});
});
