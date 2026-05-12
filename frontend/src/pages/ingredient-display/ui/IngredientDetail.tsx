import type { IngredientDtoRoot } from "home-api/dist/src";
import { getCustomIngredient } from "@/entities/ingredients";

type IngredientDetailProps = {
	ingredientDto: IngredientDtoRoot;
	rawVariantId?: string;
	rawServingSize?: number;
	rawUnit?: string;
};

const IngredientDetail = ({
	ingredientDto,
	rawVariantId,
	rawServingSize,
	rawUnit,
}: IngredientDetailProps) => {
	const errorContext: string[] = [];
	const ingredient = getCustomIngredient(
		ingredientDto,
		rawVariantId,
		rawServingSize,
		rawUnit,
		errorContext,
	);

	return (
		<>
			{errorContext.map((message, _) => (
				<div key={message}>{message}</div>
			))}
			<div>Name: {ingredient.name}</div>
			<div>Description: {ingredient.description}</div>
			<div>Serving size: {ingredient.servingSize}</div>
			<div>Unit: {ingredient.unit}</div>
			<div>Calories: {ingredient.calories}</div>
			<div>Carbs: {ingredient.carbohydrate}</div>
			<div>Fat: {ingredient.fat}</div>
			<div>Protein: {ingredient.protein}</div>
			<div>Saturated fat: {ingredient.saturatedFat}</div>
			<div>Sodium {ingredient.sodium}</div>
			<div>Sugar: {ingredient.sugar}</div>
		</>
	);
};

export { IngredientDetail };
