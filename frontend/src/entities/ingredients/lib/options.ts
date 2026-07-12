import type { IngredientVariantDto } from "home-api";

const getIngredientVariantOptions = (
	ingredientVariants: IngredientVariantDto[],
) => {
	return ingredientVariants.map((ingredientVariant) => ({
		default: ingredientVariant.defaultVariant,
		id: ingredientVariant?.id,
		value: ingredientVariant.description,
	}));
};

export { getIngredientVariantOptions };
