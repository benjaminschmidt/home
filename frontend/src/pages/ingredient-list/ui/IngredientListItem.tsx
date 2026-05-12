import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import type {
	IngredientDtoRoot,
	IngredientVariantDtoRoot,
} from "home-api/dist/src";
import { useState } from "react";
import { getIngredientVariantOptions } from "@/entities/ingredients";
import { getIngredientVariantDetailArray } from "@/pages/ingredient-list/lib/details.ts";
import { DetailGrid } from "@/pages/ingredient-list/ui/DetailGrid.tsx";
import { StyledCardActionSelector } from "@/pages/ingredient-list/ui/StyledCardActionSelector.tsx";
import { StyledCardHeader } from "@/pages/ingredient-list/ui/StyledCardHeader.tsx";
import { RouterCardActionArea } from "@/shared/ui/RouterCardActionArea.tsx";

type IngredientListItemProps = {
	ingredient: IngredientDtoRoot;
};

const IngredientListItem = ({ ingredient }: IngredientListItemProps) => {
	const ingredientVariants: IngredientVariantDtoRoot[] =
		ingredient.ingredientVariants ?? [];

	const foundIndex = ingredientVariants.findIndex((v) => v.defaultVariant);
	const defaultIndex = foundIndex !== -1 ? foundIndex : 0;

	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

	const ingredientVariant: IngredientVariantDtoRoot | undefined =
		ingredientVariants[selectedIndex];

	return (
		<ListItem key={ingredient.id} disablePadding sx={{ display: "block" }}>
			<Card
				variant="outlined"
				sx={{ height: "100%", display: "flex", flexDirection: "column" }}
			>
				<RouterCardActionArea
					to="/ingredients/$id"
					params={{ id: ingredient.id ?? "" }}
					search={
						ingredientVariant?.id ? { variantId: ingredientVariant.id } : {}
					}
				>
					<StyledCardHeader title={ingredient.name} />
				</RouterCardActionArea>
				<CardContent sx={{ pt: 1, pb: 1.5, flexGrow: 1 }}>
					<DetailGrid
						detailArray={getIngredientVariantDetailArray(ingredientVariant)}
					/>
				</CardContent>
				<Divider />
				<StyledCardActionSelector
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					options={getIngredientVariantOptions(ingredientVariants)}
				/>
			</Card>
		</ListItem>
	);
};

export { IngredientListItem };
