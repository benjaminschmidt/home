import type { IngredientVariantDto } from "home-api";

const sortIngredientVariants = (
	variants: IngredientVariantDto[],
): IngredientVariantDto[] =>
	[...variants].sort((left, right) =>
		left.description.localeCompare(right.description),
	);

export { sortIngredientVariants };
