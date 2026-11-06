import { describe, expect, it } from "vitest";
import type { CustomUnitFormValues } from "@/pages/ingredient-edit/model/customUnitFormSchema.ts";
import {
	customUnitFormSchema,
	NO_CUSTOM_UNIT,
} from "@/pages/ingredient-edit/model/customUnitFormSchema.ts";

const createDraft = (
	overrides: Partial<CustomUnitFormValues> = {},
): CustomUnitFormValues => ({
	name: "Slice",
	conversionAmount: "30",
	conversionUnit: "GRAM",
	...overrides,
});

describe("customUnitFormSchema", () => {
	it("accepts a complete conversion", () => {
		const result = customUnitFormSchema.safeParse(
			createDraft({ name: "  Slice " }),
		);

		expect(result.success).toBe(true);
		if (!result.success) return;

		expect(result.data).toEqual({
			name: "Slice",
			conversionAmount: 30,
			conversionUnit: "GRAM",
		});
	});

	it("accepts a name-only unit", () => {
		expect(
			customUnitFormSchema.safeParse(
				createDraft({
					conversionAmount: "",
					conversionUnit: NO_CUSTOM_UNIT,
				}),
			).success,
		).toBe(true);
	});

	it("requires both conversion fields when one is provided", () => {
		const result = customUnitFormSchema.safeParse(
			createDraft({ conversionUnit: NO_CUSTOM_UNIT }),
		);

		expect(result.success).toBe(false);
		if (result.success) return;

		expect(result.error.issues).toContainEqual(
			expect.objectContaining({
				path: ["conversionUnit"],
				message: "Both conversion fields are required",
			}),
		);
	});

	it.each(["0", "-1", "not-a-number", "Infinity", "NaN"])(
		"rejects an invalid conversion amount (%s)",
		(invalidValue) => {
			expect(
				customUnitFormSchema.safeParse(
					createDraft({ conversionAmount: invalidValue }),
				).success,
			).toBe(false);
		},
	);

	it("requires a name", () => {
		expect(
			customUnitFormSchema.safeParse(createDraft({ name: "  " })).success,
		).toBe(false);
	});
});
