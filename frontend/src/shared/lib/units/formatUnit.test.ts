import { describe, expect, it } from "vitest";
import { formatUnit } from "@/shared/lib/units/formatUnit.ts";

describe("formatUnit", () => {
	it("returns undefined when called with no argument", () => {
		expect(formatUnit()).toBeUndefined();
	});

	it("returns 'g' for GRAM", () => {
		expect(formatUnit("GRAM")).toBe("g");
	});

	it("returns 'mg' for MILLIGRAM", () => {
		expect(formatUnit("MILLIGRAM")).toBe("mg");
	});

	it("returns 'kg' for KILOGRAM", () => {
		expect(formatUnit("KILOGRAM")).toBe("kg");
	});

	it("returns 'oz' for OUNCE", () => {
		expect(formatUnit("OUNCE")).toBe("oz");
	});

	it("returns 'lb' for POUND", () => {
		expect(formatUnit("POUND")).toBe("lb");
	});

	it("returns 'ml' for MILLILITER", () => {
		expect(formatUnit("MILLILITER")).toBe("ml");
	});

	it("returns 'l' for LITER", () => {
		expect(formatUnit("LITER")).toBe("l");
	});

	it("returns 'fl oz' for FLUID_OUNCE", () => {
		expect(formatUnit("FLUID_OUNCE")).toBe("fl oz");
	});

	it("returns 'tsp' for TEASPOON", () => {
		expect(formatUnit("TEASPOON")).toBe("tsp");
	});

	it("returns 'tbsp' for TABLESPOON", () => {
		expect(formatUnit("TABLESPOON")).toBe("tbsp");
	});

	it("returns 'cup' for CUP", () => {
		expect(formatUnit("CUP")).toBe("cup");
	});
});
