import { faker } from "@faker-js/faker";
import type { IngredientDtoRoot } from "home-api/dist/src";
import { describe, expect, it } from "vitest";
import { dropUnnecessarySearchParams } from "@/pages/ingredient-display";
import { ingredientFactory, ingredientVariantFactory } from "@/shared/testing";

describe("dropUnnecessarySearchParams", () => {
	describe("when variantId is provided", () => {
		it("drops variantId when it matches the found variant", () => {
			// given
			const variant = ingredientVariantFactory.build({
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				undefined,
			);

			// then
			expect(result.updatedVariantId).toBeUndefined();
		});

		it("keeps variantId when it matches a non-default variant", () => {
			// given
			const defaultVariant = ingredientVariantFactory.build({
				defaultVariant: true,
			});
			const nonDefaultVariant = ingredientVariantFactory.build({
				defaultVariant: false,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [defaultVariant, nonDefaultVariant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				nonDefaultVariant.id,
				undefined,
				undefined,
			);

			// then
			expect(result.updatedVariantId).toBe(nonDefaultVariant.id);
		});

		it("drops variantId when the variant is not found", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						defaultVariant: true,
					}),
				],
			});
			const variantId = faker.string.uuid();

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variantId,
				undefined,
				undefined,
			);

			// then
			expect(result.updatedVariantId).toBeUndefined();
		});

		it("drops servingSize when it matches the found variant", () => {
			// given
			const variant = ingredientVariantFactory.build({
				servingSize: 100,
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				100,
				undefined,
			);

			// then
			expect(result.updatedServingSize).toBeUndefined();
		});

		it("keeps servingSize when it differs from the found variant", () => {
			// given
			const variant = ingredientVariantFactory.build({
				servingSize: 100,
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				200,
				undefined,
			);

			// then
			expect(result.updatedServingSize).toBe(200);
		});

		it("drops unit when it matches the found variant", () => {
			// given
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				"GRAM",
			);

			// then
			expect(result.updatedUnit).toBeUndefined();
		});

		it("keeps unit when it differs from the found variant", () => {
			// given
			const variant = ingredientVariantFactory.build({
				unit: "GRAM",
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				"KILOGRAM",
			);

			// then
			expect(result.updatedUnit).toBe("KILOGRAM");
		});
	});

	describe("when variantId is not provided", () => {
		it("drops servingSize when it matches the default variant", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 50,
						defaultVariant: true,
					}),
				],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				50,
				undefined,
			);

			// then
			expect(result.updatedServingSize).toBeUndefined();
		});

		it("keeps servingSize when it differs from the default variant", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 50,
						defaultVariant: true,
					}),
				],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				99,
				undefined,
			);

			// then
			expect(result.updatedServingSize).toBe(99);
		});

		it("drops unit when it matches the default variant", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						unit: "MILLILITER",
						defaultVariant: true,
					}),
				],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				"MILLILITER",
			);

			// then
			expect(result.updatedUnit).toBeUndefined();
		});

		it("keeps unit when it differs from the default variant", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						unit: "MILLILITER",
						defaultVariant: true,
					}),
				],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				"LITER",
			);

			// then
			expect(result.updatedUnit).toBe("LITER");
		});

		it("updatedVariantId is always undefined when variantId is not provided", () => {
			// given
			const ingredient = ingredientFactory.build();

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				undefined,
			);

			// then
			expect(result.updatedVariantId).toBeUndefined();
		});
	});

	describe("hasRedundantParams", () => {
		it("is true when variantId is dropped", () => {
			// given
			const variant = ingredientVariantFactory.build({
				defaultVariant: true,
			});
			const ingredient = ingredientFactory.build({
				ingredientVariants: [variant],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				undefined,
				undefined,
			);

			// then
			expect(result.hasRedundantParams).toBe(true);
		});

		it("is true when servingSize is dropped", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						servingSize: 100,
						defaultVariant: true,
					}),
				],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				100,
				undefined,
			);

			// then
			expect(result.hasRedundantParams).toBe(true);
		});

		it("is true when unit is dropped", () => {
			// given
			const ingredient = ingredientFactory.build({
				ingredientVariants: [
					ingredientVariantFactory.build({
						unit: "GRAM",
						defaultVariant: true,
					}),
				],
			});

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				"GRAM",
			);

			// then
			expect(result.hasRedundantParams).toBe(true);
		});

		it("is false when all provided params differ from the variant", () => {
			// given
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

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				variant.id,
				200,
				"KILOGRAM",
			);

			// then
			expect(result.hasRedundantParams).toBe(false);
		});

		it("is false when no params are provided", () => {
			// given
			const ingredient = ingredientFactory.build();

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				undefined,
				undefined,
			);

			// then
			expect(result.hasRedundantParams).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("handles ingredient with no variants", () => {
			// given
			const ingredient = ingredientFactory.build({ ingredientVariants: [] });

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				100,
				"GRAM",
			);

			// then
			expect(result.updatedServingSize).toBeUndefined();
			expect(result.updatedUnit).toBeUndefined();
			expect(result.hasRedundantParams).toBe(true);
		});

		it("handles ingredient with undefined ingredientVariants", () => {
			// given
			const ingredient: IngredientDtoRoot = { name: "Test Ingredient" };

			// when
			const result = dropUnnecessarySearchParams(
				ingredient,
				undefined,
				100,
				"GRAM",
			);

			// then
			expect(result.updatedServingSize).toBeUndefined();
			expect(result.updatedUnit).toBeUndefined();
			expect(result.hasRedundantParams).toBe(true);
		});
	});
});
