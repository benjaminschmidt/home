import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import type {
	IngredientDtoRoot,
	IngredientVariantDtoRoot,
} from "home-api/dist/src";
import { useState } from "react";
import { getIngredientVariantDetailArray } from "../lib/details.ts";
import { getIngredientVariantOptions } from "../lib/variants.ts";
import { DetailGrid } from "./DetailGrid.tsx";
import { StyledCardActionSelector } from "./StyledCardActionSelector.tsx";
import { StyledCardHeader } from "./StyledCardHeader.tsx";

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
				<StyledCardHeader title={ingredient.name} />
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
