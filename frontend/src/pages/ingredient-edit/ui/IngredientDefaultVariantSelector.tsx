import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { IngredientVariantDto } from "home-api";
import { getIngredientVariantOptions } from "@/entities/ingredients";
import {
	createIngredientFormDefaultValues,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import {
	ingredientFormSchema,
	NO_DEFAULT_VARIANT,
} from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientFormField } from "@/pages/ingredient-edit/ui/IngredientFormField.tsx";

const IngredientDefaultVariantSelector = withForm({
	defaultValues: createIngredientFormDefaultValues(),
	validators: {
		onChange: ingredientFormSchema,
	},
	props: {
		variants: [] as IngredientVariantDto[],
	},
	render: ({ form, variants }) => {
		const variantOptions = getIngredientVariantOptions(variants);
		if (variantOptions.length === 0) return null;

		return (
			<form.AppField name="defaultVariantId">
				{(field) => (
					<IngredientFormField label="Default variant">
						<FormControl fullWidth>
							<Select
								variant="standard"
								disableUnderline
								inputProps={{ "aria-label": "Default variant" }}
								value={field.state.value}
								onChange={(event) => field.handleChange(event.target.value)}
								sx={{
									"& .MuiSelect-select": {
										p: 0,
										pr: 3,
										typography: "body1",
										fontWeight: "fontWeightBold",
									},
									"& .MuiSelect-icon": { right: 0 },
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
					</IngredientFormField>
				)}
			</form.AppField>
		);
	},
});

export { IngredientDefaultVariantSelector };
