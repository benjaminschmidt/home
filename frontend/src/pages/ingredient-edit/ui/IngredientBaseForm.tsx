import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { IngredientVariantDto } from "home-api";
import { getIngredientVariantOptions } from "@/entities/ingredients";
import {
	ingredientFormCompositionOptions,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { NO_DEFAULT_VARIANT } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientConversionPanel } from "@/pages/ingredient-edit/ui/IngredientConversionPanel.tsx";
import { DeleteButton } from "@/shared/ui/button";
import { CardHeader } from "@/shared/ui/card";
import { SelectField, type SelectFieldItem, TextField } from "@/shared/ui/form";

const IngredientBaseForm = withForm({
	...ingredientFormCompositionOptions,
	props: {
		variants: [] as IngredientVariantDto[],
		onDelete: undefined as (() => void) | undefined,
		isSubmitting: false,
	},
	render: ({ form, variants, onDelete, isSubmitting }) => {
		const defaultVariantItems: SelectFieldItem[] = [
			{
				type: "option",
				key: NO_DEFAULT_VARIANT,
				value: NO_DEFAULT_VARIANT,
				label: "None",
			},
			...getIngredientVariantOptions(variants).map(
				(option): SelectFieldItem => ({
					type: "option",
					key: option.id,
					value: option.id,
					label: option.value,
				}),
			),
		];

		return (
			<Card variant="outlined" sx={{ overflow: "hidden", width: "100%" }}>
				<CardHeader
					title="Ingredient"
					action={
						onDelete === undefined ? undefined : (
							<DeleteButton onClick={onDelete} disabled={isSubmitting} />
						)
					}
				/>
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
								<SelectField
									label="Default variant"
									value={field.state.value}
									handleChange={field.handleChange}
									items={defaultVariantItems}
								/>
							)}
						</form.AppField>
					</Stack>
				</CardContent>
			</Card>
		);
	},
});

export { IngredientBaseForm };
