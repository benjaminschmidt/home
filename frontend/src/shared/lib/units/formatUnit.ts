import type { GenericUnitDtoRoot } from "home-api/dist/src";

const unitSymbols: Record<GenericUnitDtoRoot, string> = {
	GRAM: "g",
	MILLIGRAM: "mg",
	KILOGRAM: "kg",
	OUNCE: "oz",
	POUND: "lb",
	MILLILITER: "ml",
	LITER: "l",
	FLUID_OUNCE: "fl oz",
	TEASPOON: "tsp",
	TABLESPOON: "tbsp",
	CUP: "cup",
};

const formatUnit = (unit?: GenericUnitDtoRoot) =>
	unit ? unitSymbols[unit] : undefined;

export { formatUnit };
