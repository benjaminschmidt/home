import { describe, expect, it } from "vitest";
import {
	calculateConversionFactorFromDefaultUnitToCustomUnit,
	calculateConversionFactorFromUnitAToB,
} from "@/entities/ingredients/lib/conversion.ts";
import { customUnitFactory, ingredientFactory } from "@/shared/testing";

describe("calculateConversionFactorFromUnitAToB", () => {
	describe("weight to weight", () => {
		it("returns 1 when converting GRAM to GRAM", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"GRAM",
					"GRAM",
					errorContext,
				),
			).toBe(1);
			expect(errorContext).toHaveLength(0);
		});

		it("converts KILOGRAM to GRAM", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"KILOGRAM",
					"GRAM",
					errorContext,
				),
			).toBeCloseTo(1000);
			expect(errorContext).toHaveLength(0);
		});

		it("converts POUND to GRAM", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"POUND",
					"GRAM",
					errorContext,
				),
			).toBeCloseTo(453.592);
			expect(errorContext).toHaveLength(0);
		});

		it("converts OUNCE to KILOGRAM", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"OUNCE",
					"KILOGRAM",
					errorContext,
				),
			).toBeCloseTo(0.0283495);
			expect(errorContext).toHaveLength(0);
		});
	});

	describe("volume to volume", () => {
		it("returns 1 when converting MILLILITER to MILLILITER", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"MILLILITER",
					"MILLILITER",
					errorContext,
				),
			).toBe(1);
			expect(errorContext).toHaveLength(0);
		});

		it("converts LITER to MILLILITER", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"LITER",
					"MILLILITER",
					errorContext,
				),
			).toBeCloseTo(1000);
			expect(errorContext).toHaveLength(0);
		});

		it("converts CUP to TABLESPOON", () => {
			const ingredient = ingredientFactory.build();
			const errorContext: string[] = [];
			expect(
				calculateConversionFactorFromUnitAToB(
					ingredient,
					"CUP",
					"TABLESPOON",
					errorContext,
				),
			).toBeCloseTo(16);
			expect(errorContext).toHaveLength(0);
		});
	});

	describe("weight to volume", () => {
		it("returns undefined and pushes error when weightToVolumeConversionFactor is missing", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: undefined,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);
			expect(result).toBeUndefined();
			expect(errorContext).toContain(
				"Weight to volume conversion factor is undefined.",
			);
		});

		it("returns undefined and pushes error when conversionWeightUnit is missing", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 1,
				conversionWeightUnit: undefined,
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);
			expect(result).toBeUndefined();
			expect(errorContext).toContain("Conversion weight unit is undefined.");
		});

		it("returns undefined and pushes error when conversionVolumeUnit is missing", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 1,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: undefined,
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);
			expect(result).toBeUndefined();
			expect(errorContext).toContain("Conversion volume unit is undefined.");
		});

		it("converts GRAM to MILLILITER using conversion factor", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"GRAM",
				"MILLILITER",
				errorContext,
			);
			expect(result).toBeCloseTo(2);
			expect(errorContext).toHaveLength(0);
		});

		it("converts KILOGRAM to LITER using conversion factor", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"KILOGRAM",
				"LITER",
				errorContext,
			);
			expect(result).toBeCloseTo(2);
			expect(errorContext).toHaveLength(0);
		});
	});

	describe("volume to weight", () => {
		it("converts MILLILITER to GRAM using conversion factor", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"MILLILITER",
				"GRAM",
				errorContext,
			);
			expect(result).toBeCloseTo(0.5);
			expect(errorContext).toHaveLength(0);
		});

		it("converts LITER to KILOGRAM using conversion factor", () => {
			const ingredient = ingredientFactory.build({
				weightToVolumeConversionFactor: 2,
				conversionWeightUnit: "GRAM",
				conversionVolumeUnit: "MILLILITER",
			});
			const errorContext: string[] = [];
			const result = calculateConversionFactorFromUnitAToB(
				ingredient,
				"LITER",
				"KILOGRAM",
				errorContext,
			);
			expect(result).toBeCloseTo(0.5);
			expect(errorContext).toHaveLength(0);
		});
	});
});

describe("calculateConversionFactorFromDefaultUnitToCustomUnit", () => {
	it("returns undefined and pushes error when defaultUnit is undefined", () => {
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			conversionUnitToCustomUnitFactor: 2,
		});
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			undefined,
			customUnit,
			errorContext,
		);
		expect(result).toBeUndefined();
		expect(errorContext).toContain("Default unit is undefined.");
	});

	it("returns undefined and pushes error when customUnit is undefined", () => {
		const ingredient = ingredientFactory.build();
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			undefined,
			errorContext,
		);
		expect(result).toBeUndefined();
		expect(errorContext).toContain("Custom unit is undefined.");
	});

	it("returns undefined and pushes error when customUnit.conversionUnit is null", () => {
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: null as never,
			conversionUnitToCustomUnitFactor: 2,
		});
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);
		expect(result).toBeUndefined();
		expect(errorContext).toContain("Conversion unit is undefined.");
	});

	it("returns undefined and pushes error when customUnit.conversionUnitToCustomUnitFactor is null", () => {
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			conversionUnitToCustomUnitFactor: null as never,
		});
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);
		expect(result).toBeUndefined();
		expect(errorContext).toContain(
			"Conversion unit to custom unit factor is undefined.",
		);
	});

	it("converts GRAM default unit to a custom unit based on GRAM", () => {
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			conversionUnitToCustomUnitFactor: 5,
		});
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);
		expect(result).toBeCloseTo(5);
		expect(errorContext).toHaveLength(0);
	});

	it("converts KILOGRAM default unit to a custom unit based on GRAM", () => {
		const ingredient = ingredientFactory.build();
		const customUnit = customUnitFactory.build({
			conversionUnit: "GRAM",
			conversionUnitToCustomUnitFactor: 2,
		});
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"KILOGRAM",
			customUnit,
			errorContext,
		);
		expect(result).toBeCloseTo(2000);
		expect(errorContext).toHaveLength(0);
	});

	it("converts GRAM default unit to a custom unit based on MILLILITER using ingredient conversion factor", () => {
		const ingredient = ingredientFactory.build({
			weightToVolumeConversionFactor: 2,
			conversionWeightUnit: "GRAM",
			conversionVolumeUnit: "MILLILITER",
		});
		const customUnit = customUnitFactory.build({
			conversionUnit: "MILLILITER",
			conversionUnitToCustomUnitFactor: 3,
		});
		const errorContext: string[] = [];
		const result = calculateConversionFactorFromDefaultUnitToCustomUnit(
			ingredient,
			"GRAM",
			customUnit,
			errorContext,
		);
		expect(result).toBeCloseTo(6);
		expect(errorContext).toHaveLength(0);
	});
});
