import type { GenericUnitDto } from "home-api";
import { isGenericUnit } from "@/entities/ingredients/lib/unitType.ts";

const unitSymbols: Record<GenericUnitDto, string> = {
	GRAM: "g",
	MILLIGRAM: "mg",
	KILOGRAM: "kg",
	OUNCE: "oz",
	POUND: "lbs",
	MILLILITER: "ml",
	LITER: "l",
	FLUID_OUNCE: "fl oz",
	TEASPOON: "tsp",
	TABLESPOON: "tbsp",
	CUP: "cup",
};

const formatUnit = (unit?: string) => {
	if (unit === undefined) return undefined;

	return isGenericUnit(unit) ? unitSymbols[unit] : unit;
};

export { formatUnit };
