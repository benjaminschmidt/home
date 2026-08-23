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
import { CardHeader } from "@/shared/ui/card";
import { TextField } from "@/shared/ui/form";

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
			<CardHeader title="Ingredient" />
			<CardContent sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
				<Stack spacing={3}>
					<form.AppField name="name">
						{(field) => (
							<TextField
								label="Name"
								value={field.state.value}
								handleChange={field.handleChange}
								errorMessage={field.state.meta.errors[0]?.message}
							/>
						)}
					</form.AppField>
					<IngredientConversionPanel form={form} />
					<form.AppField name="defaultVariantId">
						{(field) => (
							<IngredientDefaultVariantSelector
								value={field.state.value}
								handleChange={field.handleChange}
								variants={variants}
							/>
						)}
					</form.AppField>
				</Stack>
			</CardContent>
		</Card>
	),
});

export { IngredientForm };
