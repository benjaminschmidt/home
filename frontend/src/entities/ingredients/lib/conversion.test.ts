import { describe, expect, it } from "vitest";
import {
	calculateConversionFactorFromDefaultUnitToCustomUnit,
	calculateConversionFactorFromUnitAToB,
} from "@/entities/ingredients/lib/conversion.ts";
import { customUnitFactory, ingredientFactory } from "@/shared/testing";

describe("calculateConversionFactorFromUnitAToB", () => {
	describe("weight to weight", () => {
		it("returns 1 when converting GRAM to GRAM", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"GRAM",
				errorContext,
			);

			// then
			expect(result).toBe(1);
			expect(errorContext).toHaveLength(0);
		});

		it("converts KILOGRAM to GRAM", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"KILOGRAM",
				"GRAM",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(1000);
			expect(errorContext).toHaveLength(0);
		});

		it("converts POUND to GRAM", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"POUND",
				"GRAM",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(453.592);
			expect(errorContext).toHaveLength(0);
		});

		it("converts OUNCE to KILOGRAM", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"OUNCE",
				"KILOGRAM",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(0.0283495);
			expect(errorContext).toHaveLength(0);
		});
	});

	describe("volume to volume", () => {
		it("returns 1 when converting MILLILITER to MILLILITER", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"MILLILITER",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBe(1);
			expect(errorContext).toHaveLength(0);
		});

		it("converts LITER to MILLILITER", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"LITER",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(1000);
			expect(errorContext).toHaveLength(0);
		});

		it("converts CUP to TABLESPOON", () => {
			// given
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"CUP",
				"TABLESPOON",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(16);
			expect(errorContext).toHaveLength(0);
		});
	});

	describe("weight to volume", () => {
		it("returns undefined and pushes error when weightToVolumeConversionFactor is missing", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: undefined,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBeUndefined();
			expect(errorContext).toContain(
				"Weight to volume conversion factor is undefined.",
			);
		});

		it("returns undefined and pushes error when conversionWeightUnit is missing", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 1,
				conversionWeightUnit: undefined,
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBeUndefined();
			expect(errorContext).toContain("Conversion weight unit is undefined.");
		});

		it("returns undefined and pushes error when weightToVolumeConversionFactor is 0", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 0,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBeUndefined();
			expect(errorContext).toContain(
				"Weight to volume conversion factor must be positive.",
			);
		});

		it("returns undefined and pushes error when conversionVolumeUnit is missing", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 1,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: undefined,
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBeUndefined();
			expect(errorContext).toContain("Conversion volume unit is undefined.");
		});

		it("converts GRAM to MILLILITER using conversion factor", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(2);
			expect(errorContext).toHaveLength(0);
		});

		it("converts KILOGRAM to LITER using conversion factor", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"KILOGRAM",
				"LITER",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(2);
			expect(errorContext).toHaveLength(0);
		});
	});

	describe("volume to weight", () => {
		it("converts MILLILITER to GRAM using conversion factor", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"MILLILITER",
				"GRAM",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(0.5);
			expect(errorContext).toHaveLength(0);
		});

		it("converts LITER to KILOGRAM using conversion factor", () => {
			// given
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];

			// when
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"LITER",
				"KILOGRAM",
				errorContext,
			);

			// then
			expect(result).toBeCloseTo(0.5);
			expect(errorContext).toHaveLength(0);
		});
	});
});

describe("calculateConversionFactorFromDefaultUnitToCustomUnit", () => {
	it("returns undefined and pushes error when defaultUnit is undefined", () => {
		// given
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			customUnitToConversionUnitFactor: 1 / 2,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			undefined,
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeUndefined();
		expect(errorContext).toContain("Default unit is undefined.");
	});

	it("returns undefined and pushes error when customUnit is undefined", () => {
		// given
		const ingredient = ingredientFactory.build();
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			undefined,
			errorContext,
		);

		// then
		expect(result).toBeUndefined();
		expect(errorContext).toContain("Custom unit is undefined.");
	});

	it("returns undefined and pushes error when customUnit.conversionUnit is undefined", () => {
		// given
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: undefined,
			customUnitToConversionUnitFactor: 1 / 2,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeUndefined();
		expect(errorContext).toContain("Conversion unit is undefined.");
	});

	it("returns undefined and pushes error when customUnit.customUnitToConversionUnitFactor is undefined", () => {
		// given
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			customUnitToConversionUnitFactor: undefined,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeUndefined();
		expect(errorContext).toContain(
			"Conversion unit to custom unit factor is undefined.",
		);
	});

	it("returns undefined and pushes error when customUnit.customUnitToConversionUnitFactor is negative", () => {
		// given
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			customUnitToConversionUnitFactor: -1,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeUndefined();
		expect(errorContext).toContain(
			"Conversion unit to custom unit factor must be positive.",
		);
	});

	it("converts GRAM default unit to a custom unit based on GRAM", () => {
		// given
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			customUnitToConversionUnitFactor: 1 / 5,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeCloseTo(5);
		expect(errorContext).toHaveLength(0);
	});

	it("converts KILOGRAM default unit to a custom unit based on GRAM", () => {
		// given
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			customUnitToConversionUnitFactor: 1 / 2,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"KILOGRAM",
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeCloseTo(2000);
		expect(errorContext).toHaveLength(0);
	});

	it("converts GRAM default unit to a custom unit based on MILLILITER using ingredient conversion factor", () => {
		// given
		const ingredient = ingredientFactory.build({
			weightToVolumeConversionFactor: 2,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
		});
		const customUnit = customUnitFactory.build({
			conversionUnit: "MILLILITER",
			customUnitToConversionUnitFactor: 1 / 3,
		});
		const errorContext: string[] = [];

		// when
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);

		// then
		expect(result).toBeCloseTo(6);
		expect(errorContext).toHaveLength(0);
	});
});
