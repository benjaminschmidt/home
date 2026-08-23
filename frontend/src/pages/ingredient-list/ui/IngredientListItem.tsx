import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import type { IngredientDto, IngredientVariantDto } from "home-api";
import { useState } from "react";
import {
	getIngredientNutritionDetailArray,
	getIngredientServingDetail,
	getIngredientVariantOptions,
} from "@/entities/ingredients";
import { CardActionSelector, CardHeader } from "@/shared/ui/card";
import {
	CompactDescriptionList,
	CompactDescriptionListItem,
} from "@/shared/ui/dl";
import { RouterCardActionArea } from "@/shared/ui/router";

type IngredientListItemProps = {
	ingredient: IngredientDto;
};

const IngredientListItem = ({ ingredient }: IngredientListItemProps) => {
	const ingredientVariants: IngredientVariantDto[] =
		ingredient.ingredientVariants;

	const foundIndex = ingredientVariants.findIndex((v) => v.defaultVariant);
	const defaultIndex = foundIndex !== -1 ? foundIndex : 0;

	const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

	const ingredientVariant: IngredientVariantDto | undefined =
		ingredientVariants[selectedIndex];
	const servingDetail = getIngredientServingDetail(ingredientVariant);
	const nutritionDetailArray =
		getIngredientNutritionDetailArray(ingredientVariant);

	return (
		<ListItem key={ingredient.id} disablePadding sx={{ display: "block" }}>
			<Card
				variant="outlined"
				sx={{ height: "100%", display: "flex", flexDirection: "column" }}
			>
				<RouterCardActionArea
					to="/ingredients/$id"
					params={{ id: ingredient.id }}
					search={
						ingredientVariant?.id ? { variantId: ingredientVariant.id } : {}
					}
				>
					<CardHeader title={ingredient.name} forceCompact />

					<CardContent sx={{ pt: 1, pb: 1.5, flexGrow: 1 }}>
						<CompactDescriptionList>
							<CompactDescriptionListItem
								label={servingDetail.label}
								value={servingDetail.value}
							/>
							{nutritionDetailArray.map(({ label, value }) => (
								<CompactDescriptionListItem
									key={label}
									label={label}
									value={value}
								/>
							))}
						</CompactDescriptionList>
					</CardContent>
				</RouterCardActionArea>
				<Divider />
				<CardActionSelector
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
