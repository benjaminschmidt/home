import type {
	GenericUnitDto,
	IngredientVariantDto,
	IngredientVariantWriteRequest,
} from "home-api";
import {
	formatUnit,
	genericUnitDtoArray,
	isGenericUnit,
} from "@/entities/ingredients";
import type { IngredientVariantFormValues } from "@/pages/ingredient-edit/model/ingredientVariantFormSchema.ts";
import {
	ingredientVariantFormSchema,
	NO_VARIANT_UNIT,
} from "@/pages/ingredient-edit/model/ingredientVariantFormSchema.ts";

type IngredientVariantFormInitialValues = Pick<
	IngredientVariantDto,
	| "description"
	| "unit"
	| "servingSize"
	| "calories"
	| "carbohydrate"
	| "fat"
	| "protein"
	| "saturatedFat"
	| "sodium"
	| "sugar"
>;

const formatDraftValue = (value?: number) =>
	value === undefined ? "" : String(value);

const createIngredientVariantFormDefaultValues = (
	initialValues?: Partial<IngredientVariantFormInitialValues>,
): IngredientVariantFormValues => ({
	description: initialValues?.description ?? "",
	unit: initialValues?.unit ?? NO_VARIANT_UNIT,
	servingSize: formatDraftValue(initialValues?.servingSize),
	calories: formatDraftValue(initialValues?.calories),
	carbohydrate: formatDraftValue(initialValues?.carbohydrate),
	fat: formatDraftValue(initialValues?.fat),
	protein: formatDraftValue(initialValues?.protein),
	saturatedFat: formatDraftValue(initialValues?.saturatedFat),
	sodium: formatDraftValue(initialValues?.sodium),
	sugar: formatDraftValue(initialValues?.sugar),
});

const toIngredientVariantWriteRequest = (
	values: IngredientVariantFormValues,
): IngredientVariantWriteRequest => {
	const parsedValue = ingredientVariantFormSchema.parse(values);

	return {
		description: parsedValue.description,
		unit:
			parsedValue.unit === NO_VARIANT_UNIT || !isGenericUnit(parsedValue.unit)
				? undefined
				: (parsedValue.unit as GenericUnitDto),
		servingSize: parsedValue.servingSize,
		calories: parsedValue.calories,
		carbohydrate: parsedValue.carbohydrate,
		fat: parsedValue.fat,
		protein: parsedValue.protein,
		saturatedFat: parsedValue.saturatedFat,
		sodium: parsedValue.sodium,
		sugar: parsedValue.sugar,
	};
};

const createIngredientVariantUnitItems = () => [
	{
		type: "option" as const,
		key: NO_VARIANT_UNIT,
		value: NO_VARIANT_UNIT,
		label: "None",
	},
	...genericUnitDtoArray.map((unit) => ({
		type: "option" as const,
		key: unit,
		value: unit,
		label: formatUnit(unit) ?? unit,
	})),
];

export {
	createIngredientVariantFormDefaultValues,
	createIngredientVariantUnitItems,
	toIngredientVariantWriteRequest,
};
