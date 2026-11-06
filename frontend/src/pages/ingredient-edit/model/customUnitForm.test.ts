import { describe, expect, test } from "vitest";
import {
	createCustomUnitFormDefaultValues,
	toCustomUnitWriteRequest,
} from "@/pages/ingredient-edit/model/customUnitForm.ts";

describe("custom unit form model", () => {
	test("creates defaults from a stored custom unit", () => {
		expect(
			createCustomUnitFormDefaultValues({
				name: "  Slice ",
				customUnitToConversionUnitFactor: 30,
				conversionUnit: "GRAM",
			}),
		).toEqual({
			name: "  Slice ",
			conversionAmount: "30",
			conversionUnit: "GRAM",
		});
	});

	test("maps a name-only unit to a request without conversion", () => {
		expect(
			toCustomUnitWriteRequest({
				name: "  Slice ",
				conversionAmount: "",
				conversionUnit: "",
			}),
		).toEqual({
			name: "Slice",
			customUnitToConversionUnitFactor: undefined,
			conversionUnit: undefined,
		});
	});

	test("maps a complete conversion to a request", () => {
		expect(
			toCustomUnitWriteRequest({
				name: "Slice",
				conversionAmount: "30",
				conversionUnit: "GRAM",
			}),
		).toEqual({
			name: "Slice",
			customUnitToConversionUnitFactor: 30,
			conversionUnit: "GRAM",
		});
	});
});
