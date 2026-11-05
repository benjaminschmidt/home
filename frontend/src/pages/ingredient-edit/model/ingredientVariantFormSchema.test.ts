import { describe, expect, it } from "vitest";
import type { IngredientVariantFormValues } from "@/pages/ingredient-edit/model/ingredientVariantFormSchema.ts";
import {
	ingredientVariantFormSchema,
	NO_VARIANT_UNIT,
} from "@/pages/ingredient-edit/model/ingredientVariantFormSchema.ts";

const createDraft = (
	overrides: Partial<IngredientVariantFormValues> = {},
): IngredientVariantFormValues => ({
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
	...overrides,
});

describe("ingredientVariantFormSchema", () => {
	it("parses and trims a complete variant", () => {
		const result = ingredientVariantFormSchema.safeParse(
			createDraft({ description: "  Whole " }),
		);

		expect(result.success).toBe(true);
		if (!result.success) return;

		expect(result.data).toEqual({
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

	it("accepts blank optional values and no unit", () => {
		const result = ingredientVariantFormSchema.safeParse(
			createDraft({
				unit: NO_VARIANT_UNIT,
				servingSize: "",
				calories: "",
				carbohydrate: "",
				fat: "",
				protein: "",
				saturatedFat: "",
				sodium: "",
				sugar: "",
			}),
		);

		expect(result.success).toBe(true);
	});

	it("requires a description", () => {
		const result = ingredientVariantFormSchema.safeParse(
			createDraft({ description: "  " }),
		);

		expect(result.success).toBe(false);
		if (result.success) return;

		expect(result.error.issues).toContainEqual(
			expect.objectContaining({
				path: ["description"],
				message: "Description is required",
			}),
		);
	});

	it.each(["0", "-1", "not-a-number", "Infinity", "NaN"])(
		"rejects an invalid serving size (%s)",
		(invalidValue) => {
			const result = ingredientVariantFormSchema.safeParse(
				createDraft({ servingSize: invalidValue }),
			);

			expect(result.success).toBe(false);
		},
	);

	it.each(["-1", "not-a-number", "Infinity", "NaN"])(
		"rejects an invalid nutrition value (%s)",
		(invalidValue) => {
			const result = ingredientVariantFormSchema.safeParse(
				createDraft({ calories: invalidValue }),
			);

			expect(result.success).toBe(false);
		},
	);

	it("accepts zero nutrition values", () => {
		const result = ingredientVariantFormSchema.safeParse(
			createDraft({ calories: "0", fat: "0", sugar: "0" }),
		);

		expect(result.success).toBe(true);
	});
});
