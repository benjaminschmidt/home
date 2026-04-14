import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type {
	IngredientDtoRoot,
	IngredientVariantDtoRoot,
} from "home-api/dist/src";
import { useState } from "react";

type IngredientListItemProps = {
	ingredient: IngredientDtoRoot;
};

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

const IngredientListItem = ({ ingredient }: IngredientListItemProps) => {
	const variants: IngredientVariantDtoRoot[] =
		ingredient.ingredientVariants ?? [];

	const defaultIndex =
		variants.findIndex((v) => v.defaultVariant) !== -1
			? variants.findIndex((v) => v.defaultVariant)
			: 0;

	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

	const variant: IngredientVariantDtoRoot | undefined = variants[selectedIndex];

	const servingLabel =
		variant?.servingSize != null && variant?.unit
			? `${variant.servingSize} ${unitSymbols[variant.unit] ?? variant.unit}`
			: variant?.servingSize != null
				? `${variant.servingSize}`
				: null;

	const nutrients: {
		label: string;
		value: number | undefined;
		unit: string;
	}[] = [
		{ label: "Calories", value: variant?.calories, unit: "kcal" },
		{ label: "Carbs", value: variant?.carbohydrate, unit: "g" },
		{ label: "Protein", value: variant?.protein, unit: "g" },
		{ label: "Fat", value: variant?.fat, unit: "g" },
	];

	return (
		<Card variant="elevation">
			<CardContent>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					mb={1}
				>
					<Typography variant="h6" fontWeight={600}>
						{ingredient.name}
					</Typography>
					{variants.length === 1 && (
						<Select
							value={selectedIndex}
							onChange={(e) => setSelectedIndex(Number(e.target.value))}
							size="small"
							variant="outlined"
							sx={{ fontSize: "0.75rem", minWidth: 120 }}
						>
							{variants.map((v, i) => (
								<MenuItem key={v.id ?? i} value={i}>
									{v.description}
									{v.defaultVariant ? " ★" : ""}
								</MenuItem>
							))}
						</Select>
					)}
				</Stack>
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
