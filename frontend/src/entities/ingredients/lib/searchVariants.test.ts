import { describe, expect, it } from "vitest";
import { findIngredientVariant } from "@/entities/ingredients/lib/searchVariants.ts";
import { ingredientVariantFactory } from "@/shared/testing";

describe("findIngredientVariant", () => {
	it("returns undefined and pushes error when variants are empty", () => {
		// given
		const errors: string[] = [];

		// when
		const result = findIngredientVariant([], undefined, errors);

		// then
		expect(result).toBeUndefined();
		expect(errors).toContain("Ingredient has no variants at all.");
	});

	it("returns the variant matching the given variantId", () => {
		// given
		const variant1 = ingredientVariantFactory.build({ defaultVariant: false });
		const variant2 = ingredientVariantFactory.build({ defaultVariant: true });

		// when
		const result = findIngredientVariant([variant1, variant2], variant1.id);

		// then
		expect(result).toEqual(variant1);
	});

	it("throws an error when multiple variants have the same id", () => {
		// given
		const variant1 = ingredientVariantFactory.build({ defaultVariant: false });
		const variant2 = ingredientVariantFactory.build({
			id: variant1.id,
			defaultVariant: true,
		});

		// when / then
		expect(() =>
			findIngredientVariant([variant1, variant2], variant1.id),
		).toThrow(`Multiple ingredient variants found with id "${variant1.id}".`);
	});

	it("falls back to the default variant when variantId is not found", () => {
		// given
		const errors: string[] = [];
		const variant1 = ingredientVariantFactory.build({ defaultVariant: false });
		const variant2 = ingredientVariantFactory.build({ defaultVariant: true });

		// when
		const result = findIngredientVariant(
			[variant1, variant2],
			"non-existent-id",
			errors,
		);

		// then
		expect(result).toEqual(variant2);
		expect(errors).toContain("Variant with id non-existent-id is missing.");
	});

	it("falls back to the first variant when variantId is not found and no default is set", () => {
		// given
		const variant1 = ingredientVariantFactory.build({ defaultVariant: false });
		const variant2 = ingredientVariantFactory.build({ defaultVariant: false });

		// when
		const result = findIngredientVariant(
			[variant1, variant2],
			"non-existent-id",
		);

		// then
		expect(result).toEqual(variant1);
	});

	it("returns the default variant when no variantId is provided", () => {
		// given
		const variant1 = ingredientVariantFactory.build({ defaultVariant: false });
		const variant2 = ingredientVariantFactory.build({ defaultVariant: true });

		// when
		const result = findIngredientVariant([variant1, variant2]);

		// then
		expect(result).toEqual(variant2);
	});
});
