import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { IngredientVariantDto } from "home-api";
import {
	createIngredientFormDefaultValues,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientConversionPanel } from "@/pages/ingredient-edit/ui/IngredientConversionPanel.tsx";
import { IngredientDefaultVariantSelector } from "@/pages/ingredient-edit/ui/IngredientDefaultVariantSelector.tsx";
import { IngredientTextInputField } from "@/pages/ingredient-edit/ui/IngredientTextInputField.tsx";
import { StyledCardHeader } from "@/shared/ui/StyledCardHeader.tsx";

const IngredientForm = withForm({
	defaultValues: createIngredientFormDefaultValues(),
	validators: {
		onChange: ingredientFormSchema,
	},
	props: {
		variants: [] as IngredientVariantDto[],
	},
	render: ({ form, variants }) => (
		<Card variant="outlined" sx={{ overflow: "hidden", width: "100%" }}>
			<StyledCardHeader title="Ingredient" />
			<CardContent sx={{ pt: { xs: 1, sm: 1.5 }, px: { xs: 2, sm: 2.5 } }}>
				<Stack spacing={3}>
					<form.AppField name="name">
						{(field) => (
							<IngredientTextInputField
								label="Name"
								value={field.state.value}
								handleChange={field.handleChange}
								errorMessage={field.state.meta.errors[0]?.message}
							/>
						)}
					</form.AppField>

					<IngredientConversionPanel form={form} />

					<IngredientDefaultVariantSelector form={form} variants={variants} />
				</Stack>
			</CardContent>
		</Card>
	),
});

export { IngredientForm };
