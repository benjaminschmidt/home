import { describe, expect, it } from "vitest";
import {
	isGenericUnit,
	isVolumeUnit,
	isWeightUnit,
} from "@/entities/ingredients/lib/unitType.ts";

const weightUnits = ["GRAM", "MILLIGRAM", "KILOGRAM", "OUNCE", "POUND"];
const volumeUnits = [
	"MILLILITER",
	"LITER",
	"FLUID_OUNCE",
	"TEASPOON",
	"TABLESPOON",
	"CUP",
];
const genericUnits = [...weightUnits, ...volumeUnits];

describe("unit type predicates", () => {
	it("recognises every generic unit and rejects unknown values", () => {
		expect(genericUnits.every(isGenericUnit)).toBe(true);
		expect(isGenericUnit("UNKNOWN")).toBe(false);
		expect(isGenericUnit("")).toBe(false);
	});

	it("classifies the weight-unit partition", () => {
		expect(genericUnits.filter(isWeightUnit)).toEqual(weightUnits);
		expect(isWeightUnit("UNKNOWN")).toBe(false);
	});

	it("classifies the volume-unit partition", () => {
		expect(genericUnits.filter(isVolumeUnit)).toEqual(volumeUnits);
		expect(isVolumeUnit("UNKNOWN")).toBe(false);
	});
});
