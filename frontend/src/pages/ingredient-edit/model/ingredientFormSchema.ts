import { z } from "zod";

const NO_DEFAULT_VARIANT = "";

const amountSchema = z.string().transform((draftAmount, context) => {
	const trimmedAmount = draftAmount.trim();
	if (trimmedAmount === "") return undefined;

	const amount = Number(trimmedAmount);
	if (!Number.isFinite(amount) || amount <= 0) {
		context.addIssue({
			code: "custom",
			message: "Must be a number greater than 0",
		});
		return z.NEVER;
	}

	return amount;
});

const ingredientFormSchema = z
	.object({
		name: z.string().trim().min(1, "Name is required"),
		weightAmount: amountSchema,
		weightUnit: z.string(),
		volumeAmount: amountSchema,
		volumeUnit: z.string(),
		defaultVariantId: z.union([z.literal(NO_DEFAULT_VARIANT), z.uuid()]),
	})
	.superRefine((values, context) => {
		const hasWeightAmount = values.weightAmount !== undefined;
		const hasVolumeAmount = values.volumeAmount !== undefined;
		if (hasWeightAmount === hasVolumeAmount) return;

		const message = "Both amounts are required to set a conversion";
		if (!hasWeightAmount) {
			context.addIssue({ code: "custom", path: ["weightAmount"], message });
		}
		if (!hasVolumeAmount) {
			context.addIssue({ code: "custom", path: ["volumeAmount"], message });
		}
	});

type IngredientFormValues = z.input<typeof ingredientFormSchema>;

export type { IngredientFormValues };
export { ingredientFormSchema, NO_DEFAULT_VARIANT };
