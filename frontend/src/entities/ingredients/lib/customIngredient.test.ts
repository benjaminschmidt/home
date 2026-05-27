import { describe, expect, it } from "vitest";
import { getCustomIngredient } from "@/entities/ingredients/lib/customIngredient.ts";
import {
	customUnitFactory,
	ingredientFactory,
	ingredientVariantFactory,
} from "@/shared/testing";

describe("getCustomIngredient", () => {
	it("returns ingredient with only name when no variants exist", () => {
		const ingredient = ingredientFactory.build({
			ingredientVariants: [],
		});
		const errorContext: string[] = [];

		const result = getCustomIngredient(
			ingredient,
			undefined,
			undefined,
			undefined,
			errorContext,
		);

		expect(result.name).toBe(ingredient.name);
		expect(result.servingSize).toBeUndefined();
		expect(result.unit).toBeUndefined();
		expect(result.calories).toBeUndefined();
		expect(errorContext).toContain("Ingredient has no variants at all.");
	});

	describe("when variant has missing data", () => {
		it("copies ingredient when variant servingSize is missing", () => {
			const variant = ingredientVariantFactory.build({
				servingSize: undefined,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				undefined,
				undefined,
				errorContext,
			);

			expect(result.name).toBe(ingredient.name);
			expect(result.servingSize).toBeUndefined();
			expect(errorContext).toContain(
				"Serving size is missing or 0 on ingredient variant.",
			);
		});

		it("copies ingredient when variant servingSize is 0", () => {
			const variant = ingredientVariantFactory.build({ servingSize: 0 });
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				undefined,
				undefined,
				errorContext,
			);

			expect(result.name).toBe(ingredient.name);
			expect(result.servingSize).toBe(0);
			expect(errorContext).toContain(
				"Serving size is missing or 0 on ingredient variant.",
			);
		});

		it("copies ingredient when variant unit is missing", () => {
			const variant = ingredientVariantFactory.build({ unit: undefined });
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				undefined,
				undefined,
				errorContext,
			);

			expect(result.name).toBe(ingredient.name);
			expect(errorContext).toContain("Unit is missing on ingredient variant.");
		});
	});

	describe("when using default variant values", () => {
		it("returns recalculated ingredient with variant's serving size and unit", () => {
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				servingSize: 100,
				calories: 200,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				undefined,
				undefined,
				errorContext,
			);

			expect(result.name).toBe(ingredient.name);
			expect(result.servingSize).toBe(100);
			expect(result.unit).toBe("GRAM");
			expect(result.calories).toBeCloseTo(200);
			expect(errorContext).toHaveLength(0);
		});

		it("uses default variant when no variantId is provided", () => {
			const variant = ingredientVariantFactory.build({
				defaultVariant: true,
				unit: "GRAM",
				servingSize: 100,
				calories: 150,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				undefined,
				undefined,
				undefined,
				errorContext,
			);

			expect(result.name).toBe(ingredient.name);
			expect(result.calories).toBeCloseTo(150);
			expect(errorContext).toHaveLength(0);
		});
	});

	it("scales nutrients proportionally to a custom serving size", () => {
		const variant = ingredientVariantFactory.build({
			unit: "GRAM",
			servingSize: 100,
			calories: 200,
			protein: 10,
		});
		const ingredient = ingredientFactory.build({
			ingredientVariants: [variant],
		});
		const errorContext: string[] = [];

		const result = getCustomIngredient(
			ingredient,
			variant.id,
			50,
			undefined,
			errorContext,
		);

		expect(result.servingSize).toBe(50);
		expect(result.calories).toBeCloseTo(100);
		expect(result.protein).toBeCloseTo(5);
		expect(errorContext).toHaveLength(0);
	});

	describe("when using a generic unit conversion", () => {
		it("converts nutrients when switching from GRAM to KILOGRAM", () => {
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				servingSize: 100,
				calories: 200,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				2,
				"KILOGRAM",
				errorContext,
			);

			expect(result.unit).toBe("KILOGRAM");
			expect(result.servingSize).toBe(2);
			expect(result.calories).toBeCloseTo(4000);
			expect(errorContext).toHaveLength(0);
		});

		it("returns copied ingredient when cross-category unit conversion is requested", () => {
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				servingSize: 100,
				calories: 200,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				100,
				"MILLILITER",
				errorContext,
			);

			expect(result.name).toBe(ingredient.name);
			expect(result.calories).toBe(variant.calories);
			expect(errorContext).contains(
				"Weight to volume conversion factor is undefined.",
			);
		});
	});

	describe("when using a custom unit", () => {
		it("recalculates nutrients using the custom unit conversion factor", () => {
			const customUnit = customUnitFactory.build({
				name: "slice",
				conversionUnit: "GRAM",
				customUnitToConversionUnitFactor: 30,
			});
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				servingSize: 100,
				calories: 200,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
				customUnits: [customUnit],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				1,
				"slice",
				errorContext,
			);

			expect(result.unit).toBe("slice");
			expect(result.servingSize).toBe(1);
			expect(result.calories).toBeCloseTo(60);
			expect(errorContext).toHaveLength(0);
		});

		it("returns copied ingredient when custom unit is not found", () => {
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				servingSize: 100,
				calories: 200,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
				customUnits: [],
			});
			const errorContext: string[] = [];

			const result = getCustomIngredient(
				ingredient,
				variant.id,
				1,
				"non-existent-unit",
				errorContext,
			);

			expect(result.calories).toBe(variant.calories);
			expect(errorContext).contains(
				"Custom unit non-existent-unit is missing.",
			);
		});
	});
});
