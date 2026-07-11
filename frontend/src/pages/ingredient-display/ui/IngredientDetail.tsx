import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import type { IngredientDto } from "home-api/dist/src";
import {
	getCustomIngredient,
	getIngredientNutritionDetailArray,
	getIngredientVariantOptions,
} from "@/entities/ingredients";
import { ServingGridElement } from "@/pages/ingredient-display/ui/ServingGridElement.tsx";
import { DetailGrid } from "@/shared/ui/DetailGrid.tsx";
import { DetailGridElement } from "@/shared/ui/DetailGridElement.tsx";
import { StyledCardActionSelector } from "@/shared/ui/StyledCardActionSelector.tsx";
import { StyledCardHeader } from "@/shared/ui/StyledCardHeader.tsx";

type IngredientDetailProps = {
	ingredientDto: IngredientDto;
	rawVariantId?: string;
	rawServingSize?: number;
	rawUnit?: string;
	onVariantIdChange?: (variantId?: string) => void;
	onServingChange?: (next: { servingSize?: number; unit?: string }) => void;
};

const IngredientDetail = ({
	ingredientDto,
	rawVariantId,
	rawServingSize,
	rawUnit,
	onVariantIdChange,
	onServingChange,
}: IngredientDetailProps) => {
	const ingredientVariants = ingredientDto.ingredientVariants ?? [];
	const defaultIndex = (() => {
		const selectedIndex = ingredientVariants.findIndex(
			(variant) => variant.id === rawVariantId,
		);
		if (selectedIndex !== -1) {
			return selectedIndex;
		}

		const foundDefaultIndex = ingredientVariants.findIndex(
			(variant) => variant.defaultVariant,
		);
		return foundDefaultIndex !== -1 ? foundDefaultIndex : 0;
	})();

	const errorContext: string[] = [];
	const ingredient = getCustomIngredient(
		ingredientDto,
		rawVariantId,
		rawServingSize,
		rawUnit,
		errorContext,
	);
	const nutritionDetailArray = getIngredientNutritionDetailArray(ingredient);
	const options = getIngredientVariantOptions(ingredientVariants);

	return (
		<Box sx={{ mx: "auto", width: "100%", maxWidth: 640 }}>
			<Stack spacing={2}>
				{errorContext.length > 0 && (
					<Stack spacing={1}>
						{errorContext.map((message) => (
							<Alert key={message} severity="warning" variant="outlined">
								{message}
							</Alert>
						))}
					</Stack>
				)}

				<Card
					variant="outlined"
					sx={{
						overflow: "hidden",
						width: "100%",
					}}
				>
					<StyledCardHeader title={ingredient.name} />

					<CardContent sx={{ pt: { xs: 1, sm: 1.5 }, px: { xs: 2, sm: 2.5 } }}>
						<DetailGrid>
							<ServingGridElement
								servingSize={ingredient.servingSize}
								unit={ingredient.unit}
								customUnits={ingredientDto.customUnits}
								onServingChange={onServingChange}
							/>
							{nutritionDetailArray.map(({ label, value }) => (
								<DetailGridElement key={label} label={label} value={value} />
							))}
						</DetailGrid>
					</CardContent>

					{ingredientVariants.length > 0 && (
						<>
							<Divider />
							<StyledCardActionSelector
								selectedIndex={defaultIndex}
								setSelectedIndex={(index) =>
									onVariantIdChange?.(ingredientVariants[index]?.id)
								}
								options={options}
							/>
						</>
					)}
				</Card>
			</Stack>
		</Box>
	);
};

export { IngredientDetail };
