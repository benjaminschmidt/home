import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import type { IngredientDtoRoot } from "home-api/dist/src";
import { IngredientListItem } from "./IngredientListItem";

type IngredientListProps = {
	ingredients: IngredientDtoRoot[];
};

const IngredientList = ({ ingredients }: IngredientListProps) => {
	return (
		<List>
			{ingredients.length === 0 ? (
				<ListItem divider>No ingredients found</ListItem>
			) : (
				ingredients.map((ingredient: IngredientDtoRoot, index: number) => (
					<IngredientListItem
						key={ingredient.id ?? index}
						ingredient={ingredient}
					/>
				))
			)}
		</List>
	);
};

export { IngredientList };
