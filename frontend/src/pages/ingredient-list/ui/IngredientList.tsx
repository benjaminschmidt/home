import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import type { IngredientDtoRoot } from "home-api/dist/src";

type IngredientListProps = {
	ingredients: IngredientDtoRoot[];
};

const IngredientList = ({ ingredients }: IngredientListProps) => {
	return (
		<List>
			{ingredients.length === 0 ? (
				<ListItem>No ingredients found"</ListItem>
			) : (
				ingredients.map((ingredient: IngredientDtoRoot, index: number) => (
					<ListItem key={ingredient.id ?? index}>{ingredient.name}</ListItem>
				))
			)}
		</List>
	);
};

export { IngredientList };
