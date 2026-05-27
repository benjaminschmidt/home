import { describe, expect, it } from "vitest";
import { findCustomUnit } from "@/entities/ingredients/lib/searchCustomUnits.ts";
import { customUnitFactory } from "@/shared/testing";

describe("findCustomUnit", () => {
	it("returns undefined and pushes error when custom units are empty", () => {
		// given
		const errors: string[] = [];

		// when
		const result = findCustomUnit([], "someUnit", errors);

		// then
		expect(result).toBeUndefined();
		expect(errors).toContain("Custom unit someUnit is missing.");
	});

	it("returns the custom unit matching the given name", () => {
		// given
		const unit1 = customUnitFactory.build({ name: "cup" });
		const unit2 = customUnitFactory.build({ name: "handful" });

		// when
		const result = findCustomUnit([unit1, unit2], "cup");

		// then
		expect(result).toEqual(unit1);
	});

	it("throws an error when multiple custom units have the same name", () => {
		// given
		const unit1 = customUnitFactory.build({ name: "cup" });
		const unit2 = customUnitFactory.build({ name: "cup" });

		// when / then
		expect(() => findCustomUnit([unit1, unit2], "cup")).toThrow(
			'Multiple custom units found with name "cup".',
		);
	});

	it("returns undefined and pushes error when unit name is not found", () => {
		// given
		const errors: string[] = [];
		const unit1 = customUnitFactory.build({ name: "cup" });
		const unit2 = customUnitFactory.build({ name: "handful" });

		// when
		const result = findCustomUnit([unit1, unit2], "pinch", errors);

		// then
		expect(result).toBeUndefined();
		expect(errors).toContain("Custom unit pinch is missing.");
	});
});
