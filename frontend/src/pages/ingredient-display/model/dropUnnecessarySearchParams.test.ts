import { faker } from "@faker-js/faker";
import type { IngredientDtoRoot } from "home-api/dist/src";
import { describe, expect, it } from "vitest";
import { dropUnnecessarySearchParams } from "@/pages/ingredient-display";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

describe("dropUnnecessarySearchParams", () => {
	describe("when variantId is provided", () => {
		it("drops variantId when it matches the found variant", () => {
			const variant = ingredientVariantFactory.build({
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				undefined,
			);
			expect(result.updatedVariantId).toBeUndefined();
		});

		it("keeps variantId when it matches a non-default variant", () => {
			const defaultVariant = ingredientVariantFactory.build({
				defaultVariant: true,
			});
			const nonDefaultVariant = ingredientVariantFactory.build({
				defaultVariant: false,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [defaultVariant, nonDefaultVariant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				nonDefaultVariant.id,
				undefined,
				undefined,
			);
			expect(result.updatedVariantId).toBe(nonDefaultVariant.id);
		});

		it("drops variantId when the variant is not found", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						defaultVariant: true,
					}),
				],
			});
			const variantId = faker.string.uuid();
			const result = dropUnnecessarySearchParams(
				ingredient,
				variantId,
				undefined,
				undefined,
			);
			expect(result.updatedVariantId).toBeUndefined();
		});

		it("drops servingSize when it matches the found variant", () => {
			const variant = ingredientVariantFactory.build({
				servingSize: 100,
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				100,
				undefined,
			);
			expect(result.updatedServingSize).toBeUndefined();
		});

		it("keeps servingSize when it differs from the found variant", () => {
			const variant = ingredientVariantFactory.build({
				servingSize: 100,
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				200,
				undefined,
			);
			expect(result.updatedServingSize).toBe(200);
		});

		it("drops unit when it matches the found variant", () => {
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				"GRAM",
			);
			expect(result.updatedUnit).toBeUndefined();
		});

		it("keeps unit when it differs from the found variant", () => {
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				"KILOGRAM",
			);
			expect(result.updatedUnit).toBe("KILOGRAM");
		});
	});

	describe("when variantId is not provided", () => {
		it("drops servingSize when it matches the default variant", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 50,
						defaultVariant: true,
					}),
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				50,
				undefined,
			);
			expect(result.updatedServingSize).toBeUndefined();
		});

		it("keeps servingSize when it differs from the default variant", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 50,
						defaultVariant: true,
					}),
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				99,
				undefined,
			);
			expect(result.updatedServingSize).toBe(99);
		});

		it("drops unit when it matches the default variant", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						unit: "MILLILITER",
						defaultVariant: true,
					}),
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				"MILLILITER",
			);
			expect(result.updatedUnit).toBeUndefined();
		});

		it("keeps unit when it differs from the default variant", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						unit: "MILLILITER",
						defaultVariant: true,
					}),
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				"LITER",
			);
			expect(result.updatedUnit).toBe("LITER");
		});

		it("updatedVariantId is always undefined when variantId is not provided", () => {
			const ingredient = ingredientFactory.build();
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				undefined,
			);
			expect(result.updatedVariantId).toBeUndefined();
		});
	});

	describe("hasRedundantParams", () => {
		it("is true when variantId is dropped", () => {
			const variant = ingredientVariantFactory.build({
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				undefined,
			);
			expect(result.hasRedundantParams).toBe(true);
		});

		it("is true when servingSize is dropped", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 100,
						defaultVariant: true,
					}),
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				100,
				undefined,
			);
			expect(result.hasRedundantParams).toBe(true);
		});

		it("is true when unit is dropped", () => {
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						unit: "GRAM",
						defaultVariant: true,
					}),
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				"GRAM",
			);
			expect(result.hasRedundantParams).toBe(true);
		});

		it("is false when all provided params differ from the variant", () => {
			const variant = ingredientVariantFactory.build({
				servingSize: 100,
				unit: "GRAM",
				defaultVariant: false,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 100,
						unit: "GRAM",
						defaultVariant: true,
					}),
					variant,
				],
			});
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				200,
				"KILOGRAM",
			);
			expect(result.hasRedundantParams).toBe(false);
		});

		it("is false when no params are provided", () => {
			const ingredient = ingredientFactory.build();
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				undefined,
			);
			expect(result.hasRedundantParams).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("handles ingredient with no variants", () => {
			const ingredient = ingredientFactory.build({ ingredientVariants: [] });
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				100,
				"GRAM",
			);
			expect(result.updatedServingSize).toBeUndefined();
			expect(result.updatedUnit).toBeUndefined();
			expect(result.hasRedundantParams).toBe(true);
		});

		it("handles ingredient with undefined ingredientVariants", () => {
			const ingredient: IngredientDtoRoot = { name: "Test Ingredient" };
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				100,
				"GRAM",
			);
			expect(result.updatedServingSize).toBeUndefined();
			expect(result.updatedUnit).toBeUndefined();
			expect(result.hasRedundantParams).toBe(true);
		});
	});
});
