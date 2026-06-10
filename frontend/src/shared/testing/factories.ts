import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type {
	CustomUnitDto,
	GenericUnitDto,
	IngredientDto,
	IngredientVariantDto,
} from "home-api/dist/src";

const GENERIC_UNITS: GenericUnitDto[] = [
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

export const customUnitFactory = Factory.define<CustomUnitDto>(() => ({
	id: faker.string.uuid(),
	name: faker.lorem.word(),
	customUnitToConversionUnitFactor: faker.number.float({ min: 0.1, max: 100 }),
	conversionUnit: faker.helpers.arrayElement(GENERIC_UNITS),
}));

export const ingredientVariantFactory = Factory.define<IngredientVariantDto>(
	() => ({
		id: faker.string.uuid(),
		description: faker.lorem.word(),
		defaultVariant: false,
		unit: faker.helpers.arrayElement(GENERIC_UNITS),
		servingSize: faker.number.int({ min: 1, max: 500 }),
	}),
);

export const ingredientFactory = Factory.define<IngredientDto>(() => ({
	id: faker.string.uuid(),
	name: faker.food.ingredient(),
	ingredientVariants: ingredientVariantFactory.buildList(1, {
		defaultVariant: true,
	}),
}));
