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
import { SaveButton } from "@/shared/ui/button";
import { CardHeader } from "@/shared/ui/card";
import { SelectField, type SelectFieldItem, TextField } from "@/shared/ui/form";

const IngredientBaseForm = withForm({
	...ingredientFormCompositionOptions,
	props: {
		variants: [] as IngredientVariantDto[],
		onSubmit: (() => undefined) as () => void,
		isSubmitting: false,
	},
	render: ({ form, variants, onSubmit, isSubmitting }) => {
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
			<Card
				component="form"
				aria-label="Ingredient"
				variant="outlined"
				sx={{ overflow: "hidden", width: "100%" }}
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					onSubmit();
				}}
			>
				<CardHeader
					title="Ingredient"
					action={
						<Stack direction="row" spacing={1}>
							<form.Subscribe
								selector={(state) => state.isDirty && state.canSubmit}
							>
								{(canSave) => (
									<SaveButton disabled={!canSave || isSubmitting} />
								)}
							</form.Subscribe>
						</Stack>
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
