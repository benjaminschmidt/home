import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import type { IngredientDto, IngredientVariantDto } from "home-api/dist/src";
import { useState } from "react";
import {
	getIngredientVariantDetailArray,
	getIngredientVariantOptions,
} from "@/entities/ingredients";
import { OverviewGrid } from "@/shared/ui/OverviewGrid.tsx";
import { RouterCardActionArea } from "@/shared/ui/RouterCardActionArea.tsx";
import { StyledCardActionSelector } from "@/shared/ui/StyledCardActionSelector.tsx";
import { StyledCardHeader } from "@/shared/ui/StyledCardHeader.tsx";

type IngredientListItemProps = {
	ingredient: IngredientDto;
};

const IngredientListItem = ({ ingredient }: IngredientListItemProps) => {
	const ingredientVariants: IngredientVariantDto[] =
		ingredient.ingredientVariants ?? [];

	const foundIndex = ingredientVariants.findIndex((v) => v.defaultVariant);
	const defaultIndex = foundIndex !== -1 ? foundIndex : 0;

	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

	const ingredientVariant: IngredientVariantDto | undefined =
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
					<StyledCardHeader title={ingredient.name} forceCompact />

					<CardContent sx={{ pt: 1, pb: 1.5, flexGrow: 1 }}>
						<OverviewGrid
							detailArray={getIngredientVariantDetailArray(ingredientVariant)}
						/>
					</CardContent>
				</RouterCardActionArea>
				<Divider />
				<StyledCardActionSelector
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					forceCompact
					options={getIngredientVariantOptions(ingredientVariants)}
				/>
			</Card>
		</ListItem>
	);
};

export { IngredientListItem };
