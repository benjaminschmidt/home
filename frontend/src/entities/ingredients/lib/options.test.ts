import { describe, expect, it } from "vitest";
import { getIngredientVariantOptions } from "@/entities/ingredients";

describe("getIngredientVariantOptions", () => {
	it("maps a single variant to the correct option shape", () => {
		const result = getIngredientVariantOptions([
			{ id: "1", description: "Whole", defaultVariant: true },
		]);
		expect(result).toEqual([{ default: true, id: "1", value: "Whole" }]);
	});

	it("maps multiple variants preserving order", () => {
		const result = getIngredientVariantOptions([
			{ id: "1", description: "Whole", defaultVariant: true },
			{ id: "2", description: "Sliced", defaultVariant: false },
		]);
		expect(result).toEqual([
			{ default: true, id: "1", value: "Whole" },
			{ default: false, id: "2", value: "Sliced" },
		]);
	});
});
