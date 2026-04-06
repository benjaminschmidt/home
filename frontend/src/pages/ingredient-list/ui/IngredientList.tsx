import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import type { IngredientDtoRoot } from "home-api/dist/src";
import { IngredientListItem } from "./IngredientListItem";

type IngredientListProps = {
	ingredients: IngredientDtoRoot[];
};

const IngredientList = ({ ingredients }: IngredientListProps) => {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, max-content))",
				gap: 2,
			}}
		>
			{ingredients.length === 0 ? (
				<ListItem>No ingredients found</ListItem>
			) : (
				ingredients.map((ingredient: IngredientDtoRoot, index: number) => (
					<IngredientListItem
						key={ingredient.id ?? index}
						ingredient={ingredient}
					/>
				))
			)}
		</Box>
	);
};

export { IngredientList };
