import type { IngredientDtoRoot } from "home-api/dist/src";
import {
	findIngredientVariant,
	getDefaultIngredientVariant,
} from "@/entities/ingredients";

const dropUnnecessarySearchParams = (
	ingredient: IngredientDtoRoot,
	variantId: string | undefined,
	servingSize: number | undefined,
	unit: string | undefined,
) => {
	const variants = ingredient.ingredientVariants ?? [];
	const variant = findIngredientVariant(variants, variantId);
	const defaultVariant = getDefaultIngredientVariant(variants);

	const dropVariant =
		variantId !== undefined &&
		(defaultVariant?.id === variantId || variant?.id !== variantId);
	const dropServingSize =
		servingSize !== undefined &&
		(variant?.servingSize === servingSize || variant === undefined);
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
