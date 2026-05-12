import type { IngredientVariantDtoRoot } from "home-api/dist/src";

const getIngredientVariantOptions = (
	ingredientVariants: IngredientVariantDtoRoot[],
) => {
	return ingredientVariants.map((ingredientVariant) => ({
		default: ingredientVariant.defaultVariant,
		id: ingredientVariant?.id,
		value: ingredientVariant.description,
	}));
};

export { getIngredientVariantOptions };
