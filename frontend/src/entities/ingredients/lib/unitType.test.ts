import { describe, expect, it } from "vitest";
import {
	isGenericUnit,
	isVolumeUnit,
	isWeightUnit,
} from "@/entities/ingredients/lib/unitType.ts";

describe("isGenericUnit", () => {
	it("returns true for GRAM", () => {
		// when
		const result = isGenericUnit("GRAM");

		// then
		expect(result).toBe(true);
	});

	it("returns true for MILLIGRAM", () => {
		// when
		const result = isGenericUnit("MILLIGRAM");

		// then
		expect(result).toBe(true);
	});

	it("returns true for KILOGRAM", () => {
		// when
		const result = isGenericUnit("KILOGRAM");

		// then
		expect(result).toBe(true);
	});

	it("returns true for OUNCE", () => {
		// when
		const result = isGenericUnit("OUNCE");

		// then
		expect(result).toBe(true);
	});

	it("returns true for POUND", () => {
		// when
		const result = isGenericUnit("POUND");

		// then
		expect(result).toBe(true);
	});

	it("returns true for MILLILITER", () => {
		// when
		const result = isGenericUnit("MILLILITER");

		// then
		expect(result).toBe(true);
	});

	it("returns true for LITER", () => {
		// when
		const result = isGenericUnit("LITER");

		// then
		expect(result).toBe(true);
	});

	it("returns true for FLUID_OUNCE", () => {
		// when
		const result = isGenericUnit("FLUID_OUNCE");

		// then
		expect(result).toBe(true);
	});

	it("returns true for TEASPOON", () => {
		// when
		const result = isGenericUnit("TEASPOON");

		// then
		expect(result).toBe(true);
	});

	it("returns true for TABLESPOON", () => {
		// when
		const result = isGenericUnit("TABLESPOON");

		// then
		expect(result).toBe(true);
	});

	it("returns true for CUP", () => {
		// when
		const result = isGenericUnit("CUP");

		// then
		expect(result).toBe(true);
	});

	it("returns false for an unknown value", () => {
		// when
		const result = isGenericUnit("UNKNOWN");

		// then
		expect(result).toBe(false);
	});

	it("returns false for an empty string", () => {
		// when
		const result = isGenericUnit("");

		// then
		expect(result).toBe(false);
	});
});

describe("isVolumeUnit", () => {
	it("returns true for MILLILITER", () => {
		// when
		const result = isVolumeUnit("MILLILITER");

		// then
		expect(result).toBe(true);
	});

	it("returns true for LITER", () => {
		// when
		const result = isVolumeUnit("LITER");

		// then
		expect(result).toBe(true);
	});

	it("returns true for FLUID_OUNCE", () => {
		// when
		const result = isVolumeUnit("FLUID_OUNCE");

		// then
		expect(result).toBe(true);
	});

	it("returns true for TEASPOON", () => {
		// when
		const result = isVolumeUnit("TEASPOON");

		// then
		expect(result).toBe(true);
	});

	it("returns true for TABLESPOON", () => {
		// when
		const result = isVolumeUnit("TABLESPOON");

		// then
		expect(result).toBe(true);
	});

	it("returns true for CUP", () => {
		// when
		const result = isVolumeUnit("CUP");

		// then
		expect(result).toBe(true);
	});

	it("returns false for GRAM", () => {
		// when
		const result = isVolumeUnit("GRAM");

		// then
		expect(result).toBe(false);
	});

	it("returns false for an unknown value", () => {
		// when
		const result = isVolumeUnit("UNKNOWN");

		// then
		expect(result).toBe(false);
	});

	it("returns false for an empty string", () => {
		// when
		const result = isVolumeUnit("");

		// then
		expect(result).toBe(false);
	});
});

describe("isWeightUnit", () => {
	it("returns true for GRAM", () => {
		// when
		const result = isWeightUnit("GRAM");

		// then
		expect(result).toBe(true);
	});

	it("returns true for MILLIGRAM", () => {
		// when
		const result = isWeightUnit("MILLIGRAM");

		// then
		expect(result).toBe(true);
	});

	it("returns true for KILOGRAM", () => {
		// when
		const result = isWeightUnit("KILOGRAM");

		// then
		expect(result).toBe(true);
	});

	it("returns true for OUNCE", () => {
		// when
		const result = isWeightUnit("OUNCE");

		// then
		expect(result).toBe(true);
	});

	it("returns true for POUND", () => {
		// when
		const result = isWeightUnit("POUND");

		// then
		expect(result).toBe(true);
	});

	it("returns false for MILLILITER", () => {
		// when
		const result = isWeightUnit("MILLILITER");

		// then
		expect(result).toBe(false);
	});

	it("returns false for an unknown value", () => {
		// when
		const result = isWeightUnit("UNKNOWN");

		// then
		expect(result).toBe(false);
	});

	it("returns false for an empty string", () => {
		// when
		const result = isWeightUnit("");

		// then
		expect(result).toBe(false);
	});
});
