import type { IngredientVariantDtoRoot } from "home-api/dist/src";

const getDefaultIngredientVariant = (
	ingredientVariants: IngredientVariantDtoRoot[],
) => {
	if (ingredientVariants.length === 0) {
		return undefined;
	}

	const defaultVariants = ingredientVariants.filter(
		(variant) => variant.defaultVariant,
	);

	if (defaultVariants.length > 1) {
		throw new Error(
			`Expected at most one default ingredient variant, but received ${defaultVariants.length}.`,
		);
	}

	return defaultVariants[0] ?? ingredientVariants[0];
};

const findIngredientVariant = (
	variants: IngredientVariantDtoRoot[],
	variantId?: string,
	errorContext?: string[],
) => {
	let variant: IngredientVariantDtoRoot | undefined;

	if (variantId !== undefined) {
		const matchingVariants = variants.filter((v) => v.id === variantId);
		if (matchingVariants.length > 1) {
			throw new Error(
				`Multiple ingredient variants found with id "${variantId}".`,
			);
		}
		variant = matchingVariants?.[0];
		if (variant === undefined) {
			errorContext?.push(`Variant with id ${variantId} is missing.`);
		}
	}

	if (variant === undefined) {
		variant = getDefaultIngredientVariant(variants);
	}

	if (variant === undefined) {
		errorContext?.push("Ingredient has no variants at all.");
	}

	return variant;
};

export { findIngredientVariant, getDefaultIngredientVariant };
