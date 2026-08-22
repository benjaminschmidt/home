import { describe, expect, it } from "vitest";
import type { IngredientFormValues } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import {
	ingredientFormSchema,
	NO_DEFAULT_VARIANT,
} from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";

const createDraft = (
	overrides: Partial<IngredientFormValues> = {},
): IngredientFormValues => ({
	name: "Flour",
	weightAmount: "2",
	weightUnit: "GRAM",
	volumeAmount: "5",
	volumeUnit: "MILLILITER",
	defaultVariantId: NO_DEFAULT_VARIANT,
	...overrides,
});

describe("ingredientFormSchema", () => {
	it("parses a complete form and trims the name", () => {
		const result = ingredientFormSchema.safeParse(
			createDraft({
				name: "  Flour ",
				defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
			}),
		);

		expect(result.success).toBe(true);
		if (!result.success) return;

		expect(result.data).toEqual({
			name: "Flour",
			weightAmount: 2,
			weightUnit: "GRAM",
			volumeAmount: 5,
			volumeUnit: "MILLILITER",
			defaultVariantId: "550e8400-e29b-41d4-a716-446655440000",
		});
	});

	it("accepts an empty conversion", () => {
		const result = ingredientFormSchema.safeParse(
			createDraft({ weightAmount: "", volumeAmount: "" }),
		);

		expect(result.success).toBe(true);
		if (!result.success) return;

		expect(result.data.weightAmount).toBeUndefined();
		expect(result.data.volumeAmount).toBeUndefined();
		expect(result.data.defaultVariantId).toBe(NO_DEFAULT_VARIANT);
	});

	it.each(["0", "-1", "not-a-number", "Infinity", "NaN"])(
		"rejects an invalid amount (%s)",
		(invalidAmount) => {
			const result = ingredientFormSchema.safeParse(
				createDraft({ weightAmount: invalidAmount }),
			);

			expect(result.success).toBe(false);
			if (result.success) return;

			expect(result.error.issues).toContainEqual(
				expect.objectContaining({
					path: ["weightAmount"],
					message: "Must be a number greater than 0",
				}),
			);
		},
	);

	it.each([
		["volumeAmount", { weightAmount: "2", volumeAmount: "" }],
		["weightAmount", { weightAmount: "", volumeAmount: "5" }],
	] as const)(
		"requires both conversion amounts when %s is missing",
		(missingField, amounts) => {
			const result = ingredientFormSchema.safeParse(createDraft(amounts));

			expect(result.success).toBe(false);
			if (result.success) return;

			expect(result.error.issues).toContainEqual(
				expect.objectContaining({
					path: [missingField],
					message: "Both amounts are required to set a conversion",
				}),
			);
		},
	);

	it("rejects a non-UUID default variant ID", () => {
		const result = ingredientFormSchema.safeParse(
			createDraft({ defaultVariantId: "not-a-uuid" }),
		);

		expect(result.success).toBe(false);
		if (result.success) return;

		expect(result.error.issues).toContainEqual(
			expect.objectContaining({ path: ["defaultVariantId"] }),
		);
	});
});
