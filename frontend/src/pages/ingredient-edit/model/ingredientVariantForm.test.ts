import { describe, expect, test } from "vitest";
import {
	createIngredientVariantFormDefaultValues,
	toIngredientVariantWriteRequest,
} from "@/pages/ingredient-edit/model/ingredientVariantForm.ts";

describe("ingredient variant form model", () => {
	test("creates defaults from a stored variant", () => {
		const defaults = createIngredientVariantFormDefaultValues({
			description: "  Whole ",
			unit: "GRAM",
			servingSize: 100,
			calories: 165,
			carbohydrate: 20,
			fat: 2.5,
			protein: 8,
			saturatedFat: 0.4,
			sodium: 12,
			sugar: 1,
		});

		expect(defaults).toEqual({
			description: "  Whole ",
			unit: "GRAM",
			servingSize: "100",
			calories: "165",
			carbohydrate: "20",
			fat: "2.5",
			protein: "8",
			saturatedFat: "0.4",
			sodium: "12",
			sugar: "1",
		});
	});

	test("maps optional blank fields to undefined", () => {
		const request = toIngredientVariantWriteRequest({
			...createIngredientVariantFormDefaultValues(),
			description: "  Whole ",
		});

		expect(request).toEqual({
			description: "Whole",
			unit: undefined,
			servingSize: undefined,
			calories: undefined,
			carbohydrate: undefined,
			fat: undefined,
			protein: undefined,
			saturatedFat: undefined,
			sodium: undefined,
			sugar: undefined,
		});
	});

	test("maps all writable fields to a variant request", () => {
		const request = toIngredientVariantWriteRequest({
			description: "Whole",
			unit: "GRAM",
			servingSize: "100",
			calories: "165",
			carbohydrate: "20",
			fat: "2.5",
			protein: "8",
			saturatedFat: "0.4",
			sodium: "12",
			sugar: "1",
		});

		expect(request).toEqual({
			description: "Whole",
			unit: "GRAM",
			servingSize: 100,
			calories: 165,
			carbohydrate: 20,
			fat: 2.5,
			protein: 8,
			saturatedFat: 0.4,
			sodium: 12,
			sugar: 1,
		});
	});
});
