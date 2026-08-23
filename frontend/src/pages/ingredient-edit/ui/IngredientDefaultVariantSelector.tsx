import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { IngredientVariantDto } from "home-api";
import { getIngredientVariantOptions } from "@/entities/ingredients";
import { NO_DEFAULT_VARIANT } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";

const defaultVariantLabelId = "ingredient-default-variant-label";

type IngredientDefaultVariantSelectorProps = {
	handleChange: (value: string) => void;
	value: string;
	variants: IngredientVariantDto[];
};

const IngredientDefaultVariantSelector = ({
	handleChange,
	value,
	variants,
}: IngredientDefaultVariantSelectorProps) => {
	const variantOptions = getIngredientVariantOptions(variants);

	return (
		<FormControl fullWidth>
			<InputLabel id={defaultVariantLabelId}>Default variant</InputLabel>
			<Select
				labelId={defaultVariantLabelId}
				label="Default variant"
				value={value}
				onChange={(event) => handleChange(event.target.value)}
				sx={{
					"& .MuiSelect-select": {
						typography: "body1",
						fontWeight: "fontWeightBold",
					},
				}}
			>
				<MenuItem value={NO_DEFAULT_VARIANT}>None</MenuItem>
				{variantOptions.map((option) => (
					<MenuItem key={option.id} value={option.id}>
						{option.value}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export { IngredientDefaultVariantSelector };
