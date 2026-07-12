import type { IngredientDto } from "home-api/dist/src";
import {
	calculateConversionFactorFromDefaultUnitToUnit,
	findIngredientVariant,
	getDefaultIngredientVariant,
} from "@/entities/ingredients";

const dropUnnecessarySearchParams = (
	ingredient: IngredientDto,
	variantId: string | undefined,
	servingSize: number | undefined,
	unit: string | undefined,
) => {
	const variants = ingredient.ingredientVariants ?? [];
	const variant = findIngredientVariant(variants, variantId);
	const defaultVariant = getDefaultIngredientVariant(variants);

	const effectiveUnit = unit ?? variant?.unit;
	const defaultServingSizeForUnit = (() => {
		if (
			variant?.servingSize === undefined ||
			variant.unit === undefined ||
			effectiveUnit === undefined
		) {
			return undefined;
		}

		const conversionFactor = calculateConversionFactorFromDefaultUnitToUnit(
			ingredient,
			variant.unit,
			effectiveUnit,
			[],
		);

		return conversionFactor !== undefined
			? variant.servingSize * conversionFactor
			: undefined;
	})();

	const dropVariant =
		variantId !== undefined &&
		(defaultVariant?.id === variantId || variant?.id !== variantId);
	const dropServingSize =
		servingSize !== undefined &&
		(defaultServingSizeForUnit === servingSize || variant === undefined);
	const dropUnit =
		unit !== undefined && (variant?.unit === unit || variant === undefined);

	const updatedVariantId = dropVariant ? undefined : variantId;
	const updatedServingSize = dropServingSize ? undefined : servingSize;
	const updatedUnit = dropUnit ? undefined : unit;

	return {
		updatedVariantId,
		updatedServingSize,
		updatedUnit,
		hasRedundantParams: dropVariant || dropServingSize || dropUnit,
	};
};

export { dropUnnecessarySearchParams };
