import { describe, expect, it } from "vitest";
import { findCustomUnit } from "@/entities/ingredients/lib/searchCustomUnits.ts";
import { customUnitFactory } from "@/shared/testing";

describe("findCustomUnit", () => {
	it("returns undefined and pushes error when custom units are empty", () => {
		const errors: string[] = [];
		expect(findCustomUnit([], "someUnit", errors)).toBeUndefined();
		expect(errors).toContain("Custom unit someUnit is missing.");
	});

	it("returns the custom unit matching the given name", () => {
		const unit1 = customUnitFactory.build({ name: "cup" });
		const unit2 = customUnitFactory.build({ name: "handful" });
		const result = findCustomUnit([unit1, unit2], "cup");
		expect(result).toEqual(unit1);
	});

	it("throws an error when multiple custom units have the same name", () => {
		const unit1 = customUnitFactory.build({ name: "cup" });
		const unit2 = customUnitFactory.build({ name: "cup" });
		expect(() => findCustomUnit([unit1, unit2], "cup")).toThrow(
			'Multiple custom units found with name "cup".',
		);
	});

	it("returns undefined and pushes error when unit name is not found", () => {
		const errors: string[] = [];
		const unit1 = customUnitFactory.build({ name: "cup" });
		const unit2 = customUnitFactory.build({ name: "handful" });
		const result = findCustomUnit([unit1, unit2], "pinch", errors);
		expect(result).toBeUndefined();
		expect(errors).toContain("Custom unit pinch is missing.");
	});
});
