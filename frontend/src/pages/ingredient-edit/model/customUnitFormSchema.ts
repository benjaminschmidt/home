import { z } from "zod";

const NO_CUSTOM_UNIT = "";

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

const customUnitFormSchema = z
	.object({
		name: z.string().trim().min(1, "Name is required"),
		conversionAmount: optionalPositiveNumberSchema,
		conversionUnit: z.string(),
	})
	.superRefine((values, context) => {
		const hasAmount = values.conversionAmount !== undefined;
		const hasUnit = values.conversionUnit.trim() !== NO_CUSTOM_UNIT;
		if (hasAmount === hasUnit) return;

		const message = "Both conversion fields are required";
		if (!hasAmount) {
			context.addIssue({
				code: "custom",
				path: ["conversionAmount"],
				message,
			});
		}
		if (!hasUnit) {
			context.addIssue({
				code: "custom",
				path: ["conversionUnit"],
				message,
			});
		}
	});

type CustomUnitFormValues = z.input<typeof customUnitFormSchema>;

export type { CustomUnitFormValues };
export { customUnitFormSchema, NO_CUSTOM_UNIT };
