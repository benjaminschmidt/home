import { z } from "zod";

const NO_VARIANT_UNIT = "";

const optionalNonNegativeNumberSchema = z
	.string()
	.transform((draftValue, context) => {
		const trimmedValue = draftValue.trim();
		if (trimmedValue === "") return undefined;

		const value = Number(trimmedValue);
		if (!Number.isFinite(value) || value < 0) {
			context.addIssue({
				code: "custom",
				message: "Must be a number greater than or equal to 0",
			});
			return z.NEVER;
		}

		return value;
	});

const optionalPositiveNumberSchema = z
	.string()
	.transform((draftValue, context) => {
		const trimmedValue = draftValue.trim();
		if (trimmedValue === "") return undefined;

		const value = Number(trimmedValue);
		if (!Number.isFinite(value) || value <= 0) {
			context.addIssue({
				code: "custom",
				message: "Must be a number greater than 0",
			});
			return z.NEVER;
		}

		return value;
	});

const ingredientVariantFormSchema = z.object({
	description: z.string().trim().min(1, "Description is required"),
	unit: z.string(),
	servingSize: optionalPositiveNumberSchema,
	calories: optionalNonNegativeNumberSchema,
	carbohydrate: optionalNonNegativeNumberSchema,
	fat: optionalNonNegativeNumberSchema,
	protein: optionalNonNegativeNumberSchema,
	saturatedFat: optionalNonNegativeNumberSchema,
	sodium: optionalNonNegativeNumberSchema,
	sugar: optionalNonNegativeNumberSchema,
});

type IngredientVariantFormValues = z.input<typeof ingredientVariantFormSchema>;

export type { IngredientVariantFormValues };
export { ingredientVariantFormSchema, NO_VARIANT_UNIT };
