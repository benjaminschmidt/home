import { describe, expect, test } from "vitest";
import { getUnitOptions } from "@/entities/ingredients/lib/unitOptions.ts";
import type { Ingredient } from "@/entities/ingredients/model/ingredient.ts";

const ingredient: Ingredient = {
	name: "ingredient",
	defaultUnit: "GRAM",
	customUnits: [],
};

describe("getUnitOptions", () => {
	test("returns same-category generic unit options", () => {
		// when
		const result = getUnitOptions(ingredient);

		// then
		expect(result.weight).toEqual([
			{ key: "GRAM", value: "GRAM", displayText: "g" },
			{ key: "MILLIGRAM", value: "MILLIGRAM", displayText: "mg" },
			{ key: "KILOGRAM", value: "KILOGRAM", displayText: "kg" },
			{ key: "OUNCE", value: "OUNCE", displayText: "oz" },
			{ key: "POUND", value: "POUND", displayText: "lbs" },
		]);
		expect(result.volume).toEqual([]);
		expect(result.custom).toEqual([]);
	});

	test("returns cross-category generic unit options when ingredient has conversion data", () => {
		// when
		const result = getUnitOptions({
			...ingredient,
			weightToVolumeConversionFactor: 1,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
		});

		// then
		expect(result.volume).toEqual([
			{ key: "MILLILITER", value: "MILLILITER", displayText: "ml" },
			{ key: "LITER", value: "LITER", displayText: "l" },
			{ key: "FLUID_OUNCE", value: "FLUID_OUNCE", displayText: "fl oz" },
			{ key: "TEASPOON", value: "TEASPOON", displayText: "tsp" },
			{ key: "TABLESPOON", value: "TABLESPOON", displayText: "tbsp" },
			{ key: "CUP", value: "CUP", displayText: "cup" },
		]);
	});

	test("does not return cross-category generic unit options when conversion factor is zero", () => {
		// when
		const result = getUnitOptions({
			...ingredient,
			weightToVolumeConversionFactor: 0,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
		});

		// then
		expect(result.volume).toEqual([]);
	});

	test("returns only convertible custom unit options", () => {
		// when
		const result = getUnitOptions({
			...ingredient,
			weightToVolumeConversionFactor: 1,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
			customUnits: [
				{
					name: "slice",
					customUnitToConversionUnitFactor: 30,
					conversionUnit: "GRAM",
				},
				{
					name: "cup",
					customUnitToConversionUnitFactor: 240,
					conversionUnit: "MILLILITER",
				},
				{
					name: "missing factor",
					conversionUnit: "GRAM",
				},
				{
					name: "zero factor",
					customUnitToConversionUnitFactor: 0,
					conversionUnit: "GRAM",
				},
				{
					name: "missing conversion unit",
					customUnitToConversionUnitFactor: 1,
				},
			],
		});

		// then
		expect(result.custom).toEqual([
			{ key: "slice", value: "slice", displayText: "slice" },
			{ key: "cup", value: "cup", displayText: "cup" },
		]);
	});

	test("does not return cross-category custom unit options without ingredient conversion data", () => {
		// when
		const result = getUnitOptions({
			...ingredient,
			customUnits: [
				{
					name: "cup",
					customUnitToConversionUnitFactor: 240,
					conversionUnit: "MILLILITER",
				},
			],
		});

		// then
		expect(result.custom).toEqual([]);
	});
});
