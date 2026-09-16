import { describe, expect, it } from "vitest";
import { formatUnit } from "@/entities/ingredients/lib/formatUnit.ts";

describe("formatUnit", () => {
	it("formats every generic unit with its display symbol", () => {
		const expectedSymbols = {
			GRAM: "g",
			MILLIGRAM: "mg",
			KILOGRAM: "kg",
			OUNCE: "oz",
			POUND: "lbs",
			MILLILITER: "ml",
			LITER: "l",
			FLUID_OUNCE: "fl oz",
			TEASPOON: "tsp",
			TABLESPOON: "tbsp",
			CUP: "cup",
		};

		expect(
			Object.fromEntries(
				Object.keys(expectedSymbols).map((unit) => [unit, formatUnit(unit)]),
			),
		).toEqual(expectedSymbols);
	});

	it("preserves absent and custom units", () => {
		expect(formatUnit()).toBeUndefined();
		expect(formatUnit("slice")).toBe("slice");
	});
});
