import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type {
	IngredientWriteRequest,
	VolumeUnitDto,
	WeightUnitDto,
} from "home-api";
import { volumeUnitDtoArray, weightUnitDtoArray } from "@/entities/ingredients";
import type { IngredientFormValues } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import {
	ingredientFormSchema,
	NO_DEFAULT_VARIANT,
} from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
	fieldComponents: {},
	fieldContext,
	formComponents: {},
	formContext,
});

type IngredientFormInitialValues = {
	name?: string;
	weightToVolumeConversionFactor?: number;
	conversionWeightUnit?: WeightUnitDto;
	conversionVolumeUnit?: VolumeUnitDto;
};

const formatDraftAmount = (amount: number) =>
	`${Number(amount.toPrecision(12))}`;

const createIngredientFormDefaultValues = (
	initialValues?: IngredientFormInitialValues,
	defaultVariantId?: string,
): IngredientFormValues => {
	const hasStoredConversion =
		initialValues?.weightToVolumeConversionFactor !== undefined &&
		initialValues.conversionWeightUnit !== undefined &&
		initialValues.conversionVolumeUnit !== undefined;

	return {
		name: initialValues?.name ?? "",
		weightAmount: hasStoredConversion ? "1" : "",
		weightUnit: (initialValues?.conversionWeightUnit ??
			weightUnitDtoArray[0]) as string,
		volumeAmount:
			hasStoredConversion &&
			initialValues?.weightToVolumeConversionFactor !== undefined
				? formatDraftAmount(initialValues.weightToVolumeConversionFactor)
				: "",
		volumeUnit: (initialValues?.conversionVolumeUnit ??
			volumeUnitDtoArray[0]) as string,
		defaultVariantId: defaultVariantId ?? NO_DEFAULT_VARIANT,
	};
};

const toIngredientWriteRequest = (
	values: IngredientFormValues,
): IngredientWriteRequest => {
	const parsedValue = ingredientFormSchema.parse(values);

	return {
		name: parsedValue.name,
		weightToVolumeConversionFactor:
			parsedValue.weightAmount !== undefined &&
			parsedValue.volumeAmount !== undefined
				? parsedValue.volumeAmount / parsedValue.weightAmount
				: undefined,
		conversionWeightUnit:
			parsedValue.weightAmount !== undefined &&
			parsedValue.volumeAmount !== undefined
				? (parsedValue.weightUnit as WeightUnitDto)
				: undefined,
		conversionVolumeUnit:
			parsedValue.weightAmount !== undefined &&
			parsedValue.volumeAmount !== undefined
				? (parsedValue.volumeUnit as VolumeUnitDto)
				: undefined,
		defaultVariantId:
			parsedValue.defaultVariantId === NO_DEFAULT_VARIANT
				? undefined
				: parsedValue.defaultVariantId,
	};
};

export type { IngredientFormInitialValues };
export {
	createIngredientFormDefaultValues,
	toIngredientWriteRequest,
	useAppForm,
	withForm,
};
