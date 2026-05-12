import { describe, expect, it } from "vitest";
import {
	isGenericUnit,
	isVolumeUnit,
	isWeightUnit,
} from "@/entities/ingredients/lib/unitType.ts";

describe("isGenericUnit", () => {
	it("returns true for GRAM", () => {
		expect(isGenericUnit("GRAM")).toBe(true);
	});

	it("returns true for MILLIGRAM", () => {
		expect(isGenericUnit("MILLIGRAM")).toBe(true);
	});

	it("returns true for KILOGRAM", () => {
		expect(isGenericUnit("KILOGRAM")).toBe(true);
	});

	it("returns true for OUNCE", () => {
		expect(isGenericUnit("OUNCE")).toBe(true);
	});

	it("returns true for POUND", () => {
		expect(isGenericUnit("POUND")).toBe(true);
	});

	it("returns true for MILLILITER", () => {
		expect(isGenericUnit("MILLILITER")).toBe(true);
	});

	it("returns true for LITER", () => {
		expect(isGenericUnit("LITER")).toBe(true);
	});

	it("returns true for FLUID_OUNCE", () => {
		expect(isGenericUnit("FLUID_OUNCE")).toBe(true);
	});

	it("returns true for TEASPOON", () => {
		expect(isGenericUnit("TEASPOON")).toBe(true);
	});

	it("returns true for TABLESPOON", () => {
		expect(isGenericUnit("TABLESPOON")).toBe(true);
	});

	it("returns true for CUP", () => {
		expect(isGenericUnit("CUP")).toBe(true);
	});

	it("returns false for an unknown value", () => {
		expect(isGenericUnit("UNKNOWN")).toBe(false);
	});

	it("returns false for an empty string", () => {
		expect(isGenericUnit("")).toBe(false);
	});
});

describe("isVolumeUnit", () => {
	it("returns true for MILLILITER", () => {
		expect(isVolumeUnit("MILLILITER")).toBe(true);
	});

	it("returns true for LITER", () => {
		expect(isVolumeUnit("LITER")).toBe(true);
	});

	it("returns true for FLUID_OUNCE", () => {
		expect(isVolumeUnit("FLUID_OUNCE")).toBe(true);
	});

	it("returns true for TEASPOON", () => {
		expect(isVolumeUnit("TEASPOON")).toBe(true);
	});

	it("returns true for TABLESPOON", () => {
		expect(isVolumeUnit("TABLESPOON")).toBe(true);
	});

	it("returns true for CUP", () => {
		expect(isVolumeUnit("CUP")).toBe(true);
	});

	it("returns false for GRAM", () => {
		expect(isVolumeUnit("GRAM")).toBe(false);
	});

	it("returns false for an unknown value", () => {
		expect(isVolumeUnit("UNKNOWN")).toBe(false);
	});

	it("returns false for an empty string", () => {
		expect(isVolumeUnit("")).toBe(false);
	});
});

describe("isWeightUnit", () => {
	it("returns true for GRAM", () => {
		expect(isWeightUnit("GRAM")).toBe(true);
	});

	it("returns true for MILLIGRAM", () => {
		expect(isWeightUnit("MILLIGRAM")).toBe(true);
	});

	it("returns true for KILOGRAM", () => {
		expect(isWeightUnit("KILOGRAM")).toBe(true);
	});

	it("returns true for OUNCE", () => {
		expect(isWeightUnit("OUNCE")).toBe(true);
	});

	it("returns true for POUND", () => {
		expect(isWeightUnit("POUND")).toBe(true);
	});

	it("returns false for MILLILITER", () => {
		expect(isWeightUnit("MILLILITER")).toBe(false);
	});

	it("returns false for an unknown value", () => {
		expect(isWeightUnit("UNKNOWN")).toBe(false);
	});

	it("returns false for an empty string", () => {
		expect(isWeightUnit("")).toBe(false);
	});
});
