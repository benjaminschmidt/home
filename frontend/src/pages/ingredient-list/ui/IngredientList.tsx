import List from "@mui/material/List";
import type { IngredientDtoRoot } from "home-api/dist/src";
import { IngredientListItem } from "./IngredientListItem";

type IngredientListProps = {
	ingredients: IngredientDtoRoot[];
};

const IngredientList = ({ ingredients }: IngredientListProps) => {
	return (
		<List
			sx={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
				gap: 2,
			}}
		>
			{ingredients.map((ingredient: IngredientDtoRoot, index: number) => (
				<IngredientListItem
					key={ingredient.id ?? index}
					ingredient={ingredient}
				/>
			))}
		</List>
	);
};

export { IngredientList };
