import List from "@mui/material/List";
import type { IngredientDto } from "home-api";
import type { RefObject } from "react";
import { IngredientListItem } from "@/pages/ingredient-list/ui/IngredientListItem.tsx";

type IngredientListProps = {
	ingredients: IngredientDto[];
	sentinelRef?: RefObject<HTMLDivElement | null>;
};

const IngredientList = ({ ingredients, sentinelRef }: IngredientListProps) => {
	return (
		<>
			<List
				sx={{
					display: "grid",
					gridTemplateColumns:
						"repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
					gap: 2,
					minWidth: 0,
				}}
			>
				{ingredients.map((ingredient: IngredientDto, index: number) => (
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
