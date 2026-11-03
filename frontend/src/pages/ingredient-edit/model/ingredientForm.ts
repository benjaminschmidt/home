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
	conversionWeightAmount?: number;
	conversionVolumeAmount?: number;
	conversionWeightUnit?: WeightUnitDto;
	conversionVolumeUnit?: VolumeUnitDto;
};

const formatDraftAmount = (amount: number) => String(amount);

const createIngredientFormDefaultValues = (
	initialValues?: IngredientFormInitialValues,
	defaultVariantId?: string,
): IngredientFormValues => {
	const conversionWeightAmount = initialValues?.conversionWeightAmount;
	const conversionVolumeAmount = initialValues?.conversionVolumeAmount;
	const hasStoredConversion =
		conversionWeightAmount !== undefined &&
		conversionVolumeAmount !== undefined &&
		initialValues?.conversionWeightUnit !== undefined &&
		initialValues?.conversionVolumeUnit !== undefined;
	let weightAmount = "";
	let volumeAmount = "";

	if (hasStoredConversion) {
		weightAmount = formatDraftAmount(conversionWeightAmount);
		volumeAmount = formatDraftAmount(conversionVolumeAmount);
	}

	return {
		name: initialValues?.name ?? "",
		weightAmount,
		weightUnit: (initialValues?.conversionWeightUnit ??
			weightUnitDtoArray[0]) as string,
		volumeAmount,
		volumeUnit: (initialValues?.conversionVolumeUnit ??
			volumeUnitDtoArray[0]) as string,
		defaultVariantId: defaultVariantId ?? NO_DEFAULT_VARIANT,
	};
};

const ingredientFormCompositionOptions = {
	defaultValues: createIngredientFormDefaultValues(),
	validators: {
		onChange: ingredientFormSchema,
	},
};

const toIngredientWriteRequest = (
	values: IngredientFormValues,
): IngredientWriteRequest => {
	const parsedValue = ingredientFormSchema.parse(values);
	const hasConversion =
		parsedValue.weightAmount !== undefined &&
		parsedValue.volumeAmount !== undefined;

	return {
		name: parsedValue.name,
		conversionWeightAmount: hasConversion
			? parsedValue.weightAmount
			: undefined,
		conversionVolumeAmount: hasConversion
			? parsedValue.volumeAmount
			: undefined,
		conversionWeightUnit: hasConversion
			? (parsedValue.weightUnit as WeightUnitDto)
			: undefined,
		conversionVolumeUnit: hasConversion
			? (parsedValue.volumeUnit as VolumeUnitDto)
			: undefined,
		defaultVariantId:
			parsedValue.defaultVariantId === NO_DEFAULT_VARIANT
				? undefined
				: parsedValue.defaultVariantId,
	};
};

export {
	createIngredientFormDefaultValues,
	ingredientFormCompositionOptions,
	toIngredientWriteRequest,
	useAppForm,
	withForm,
};
