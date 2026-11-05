import type { IngredientVariantDto } from "home-api";
import { describe, expect, test } from "vitest";
import { sortIngredientVariants } from "@/entities/ingredients/lib/sortVariants.ts";

describe("sortIngredientVariants", () => {
	test("sorts variants alphabetically without mutating the input", () => {
		const variants: IngredientVariantDto[] = [
			{ id: "unsalted", description: "Unsalted", defaultVariant: false },
			{ id: "salted", description: "Salted", defaultVariant: false },
			{ id: "test", description: "Test", defaultVariant: false },
		];

		expect(
			sortIngredientVariants(variants).map((variant) => variant.description),
		).toEqual(["Salted", "Test", "Unsalted"]);
		expect(variants.map((variant) => variant.description)).toEqual([
			"Unsalted",
			"Salted",
			"Test",
		]);
	});
});
