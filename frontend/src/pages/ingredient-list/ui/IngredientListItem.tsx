import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import type { IngredientDtoRoot } from "home-api/dist/src";

type IngredientListItemProps = {
	ingredient: IngredientDtoRoot;
};

const IngredientListItem = ({ ingredient }: IngredientListItemProps) => {
	const defaultVariant =
		ingredient.ingredientVariants?.find((v) => v.defaultVariant) ??
		ingredient.ingredientVariants?.[0];

	return (
		<ListItem divider>
			<ListItemText
				primary={ingredient.name}
				secondary={
					defaultVariant ? (
						<Box component="span" sx={{ display: "block" }}>
							<Typography
								component="span"
								variant="body2"
								color="text.secondary"
							>
								Serving: {defaultVariant.servingSize} {defaultVariant.unit} |{" "}
								Calories: {defaultVariant.calories} | Carbs:{" "}
								{defaultVariant.carbohydrate}g | Protein:{" "}
								{defaultVariant.protein}g | Fat: {defaultVariant.fat}g
							</Typography>
						</Box>
					) : (
						"No nutritional information available"
					)
				}
			/>
		</ListItem>
	);
};

export { IngredientListItem };
