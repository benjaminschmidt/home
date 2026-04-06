import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type {
	IngredientDtoRoot,
	IngredientVariantDtoRoot,
} from "home-api/dist/src";

type IngredientListItemProps = {
	ingredient: IngredientDtoRoot;
};

const IngredientListItem = ({ ingredient }: IngredientListItemProps) => {
	const defaultVariant: IngredientVariantDtoRoot | undefined =
		ingredient.ingredientVariants?.find((v) => v.defaultVariant) ??
		ingredient.ingredientVariants?.[0];

	const unitSymbols: Record<string, string> = {
		GRAM: "g",
		MILLIGRAM: "mg",
		KILOGRAM: "kg",
		OUNCE: "oz",
		POUND: "lb",
		MILLILITER: "ml",
		LITER: "l",
		FLUID_OUNCE: "fl oz",
		TEASPOON: "tsp",
		TABLESPOON: "tbsp",
		CUP: "cup",
	};

	const servingLabel =
		defaultVariant?.servingSize != null && defaultVariant?.unit
			? `${defaultVariant.servingSize} ${unitSymbols[defaultVariant.unit] ?? defaultVariant.unit}`
			: defaultVariant?.servingSize != null
				? `${defaultVariant.servingSize}`
				: null;

	const nutrients: {
		label: string;
		value: number | undefined;
		unit: string;
	}[] = [
		{ label: "Calories", value: defaultVariant?.calories, unit: "kcal" },
		{ label: "Carbs", value: defaultVariant?.carbohydrate, unit: "g" },
		{ label: "Protein", value: defaultVariant?.protein, unit: "g" },
		{ label: "Fat", value: defaultVariant?.fat, unit: "g" },
	];

	return (
		<Card variant="elevation">
			<CardContent>
				<Typography variant="h6" fontWeight={600} mb={1}>
					{ingredient.name}
				</Typography>
				<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
					{servingLabel && (
						<Chip
							label={`Serving size: ${servingLabel}`}
							size="small"
							variant="outlined"
							color="default"
						/>
					)}
					{nutrients.map(
						({ label, value, unit }) =>
							value != null && (
								<Chip
									key={label}
									label={`${label}: ${value} ${unit}`}
									size="small"
									variant="outlined"
									color="default"
								/>
							),
					)}
				</Stack>
			</CardContent>
		</Card>
	);
};

export { IngredientListItem };
