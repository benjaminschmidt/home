import List from "@mui/material/List";
import type { IngredientDtoRoot } from "home-api/dist/src";
import type { RefObject } from "react";
import { IngredientListItem } from "@/pages/ingredient-list/ui/IngredientListItem.tsx";

type IngredientListProps = {
	ingredients: IngredientDtoRoot[];
	sentinelRef?: RefObject<HTMLDivElement | null>;
};

const IngredientList = ({ ingredients, sentinelRef }: IngredientListProps) => {
	return (
		<>
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
			{sentinelRef && <div ref={sentinelRef} />}
		</>
	);
};

export { IngredientList };
