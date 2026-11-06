import type {
	CustomUnitDto,
	CustomUnitWriteRequest,
	GenericUnitDto,
} from "home-api";
import {
	formatUnit,
	genericUnitDtoArray,
	isGenericUnit,
} from "@/entities/ingredients";
import type { CustomUnitFormValues } from "@/pages/ingredient-edit/model/customUnitFormSchema.ts";
import {
	customUnitFormSchema,
	NO_CUSTOM_UNIT,
} from "@/pages/ingredient-edit/model/customUnitFormSchema.ts";

type CustomUnitFormInitialValues = Pick<
	CustomUnitDto,
	"name" | "customUnitToConversionUnitFactor" | "conversionUnit"
>;

const formatDraftValue = (value?: number) =>
	value === undefined ? "" : String(value);

const createCustomUnitFormDefaultValues = (
	initialValues?: Partial<CustomUnitFormInitialValues>,
): CustomUnitFormValues => ({
	name: initialValues?.name ?? "",
	conversionAmount: formatDraftValue(
		initialValues?.customUnitToConversionUnitFactor,
	),
	conversionUnit: initialValues?.conversionUnit ?? NO_CUSTOM_UNIT,
});

const toCustomUnitWriteRequest = (
	values: CustomUnitFormValues,
): CustomUnitWriteRequest => {
	const parsedValue = customUnitFormSchema.parse(values);

	return {
		name: parsedValue.name,
		customUnitToConversionUnitFactor: parsedValue.conversionAmount,
		conversionUnit:
			parsedValue.conversionUnit === NO_CUSTOM_UNIT ||
			!isGenericUnit(parsedValue.conversionUnit)
				? undefined
				: (parsedValue.conversionUnit as GenericUnitDto),
	};
};

const createCustomUnitConversionUnitItems = () => [
	{
		type: "option" as const,
		key: NO_CUSTOM_UNIT,
		value: NO_CUSTOM_UNIT,
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
	createCustomUnitConversionUnitItems,
	createCustomUnitFormDefaultValues,
	toCustomUnitWriteRequest,
};
