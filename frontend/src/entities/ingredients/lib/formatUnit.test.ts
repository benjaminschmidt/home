import { describe, expect, it } from "vitest";
import { formatUnit } from "@/entities/ingredients/lib/formatUnit.ts";

describe("formatUnit", () => {
	it("returns undefined when called with no argument", () => {
		// when
		const result = formatUnit();

		// then
		expect(result).toBeUndefined();
	});

	it("returns 'g' for GRAM", () => {
		// when
		const result = formatUnit("GRAM");

		// then
		expect(result).toBe("g");
	});

	it("returns 'mg' for MILLIGRAM", () => {
		// when
		const result = formatUnit("MILLIGRAM");

		// then
		expect(result).toBe("mg");
	});

	it("returns 'kg' for KILOGRAM", () => {
		// when
		const result = formatUnit("KILOGRAM");

		// then
		expect(result).toBe("kg");
	});

	it("returns 'oz' for OUNCE", () => {
		// when
		const result = formatUnit("OUNCE");

		// then
		expect(result).toBe("oz");
	});

	it("returns 'lb' for POUND", () => {
		// when
		const result = formatUnit("POUND");

		// then
		expect(result).toBe("lbs");
	});

	it("returns 'ml' for MILLILITER", () => {
		// when
		const result = formatUnit("MILLILITER");

		// then
		expect(result).toBe("ml");
	});

	it("returns 'l' for LITER", () => {
		// when
		const result = formatUnit("LITER");

		// then
		expect(result).toBe("l");
	});

	it("returns 'fl oz' for FLUID_OUNCE", () => {
		// when
		const result = formatUnit("FLUID_OUNCE");

		// then
		expect(result).toBe("fl oz");
	});

	it("returns 'tsp' for TEASPOON", () => {
		// when
		const result = formatUnit("TEASPOON");

		// then
		expect(result).toBe("tsp");
	});

	it("returns 'tbsp' for TABLESPOON", () => {
		// when
		const result = formatUnit("TABLESPOON");

		// then
		expect(result).toBe("tbsp");
	});

	it("returns 'cup' for CUP", () => {
		// when
		const result = formatUnit("CUP");

		// then
		expect(result).toBe("cup");
	});
});
