import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	CustomUnitDtoRoot,
	GenericUnitDtoRoot,
	IngredientDtoRoot,
	IngredientVariantDtoRoot,
} from "home-api/dist/src";

const GENERIC_UNITS: GenericUnitDtoRoot[] = [
	"GRAM",
	"MILLIGRAM",
	"KILOGRAM",
	"OUNCE",
	"POUND",
	"MILLILITER",
	"LITER",
	"FLUID_OUNCE",
	"TEASPOON",
	"TABLESPOON",
	"CUP",
];

export const customUnitFactory = Factory.define<CustomUnitDtoRoot>(() => ({
	id: faker.string.uuid(),
	name: faker.lorem.word(),
	customUnitToConversionUnitFactor: faker.number.float({ min: 0.1, max: 100 }),
	conversionUnit: faker.helpers.arrayElement(GENERIC_UNITS),
}));

export const ingredientVariantFactory =
	Factory.define<IngredientVariantDtoRoot>(() => ({
		id: faker.string.uuid(),
		description: faker.lorem.word(),
		defaultVariant: false,
		unit: faker.helpers.arrayElement(GENERIC_UNITS),
		servingSize: faker.number.int({ min: 1, max: 500 }),
	}));

export const ingredientFactory = Factory.define<IngredientDtoRoot>(() => ({
	id: faker.string.uuid(),
	name: faker.food.ingredient(),
	ingredientVariants: ingredientVariantFactory.buildList(1, {
		defaultVariant: true,
	}),
}));
