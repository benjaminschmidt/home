import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { createUpdateIngredientMutationOptions } from "@/entities/ingredients";
import {
	createIngredientFormDefaultValues,
	toIngredientWriteRequest,
	useAppForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientForm } from "@/pages/ingredient-edit/ui/IngredientForm.tsx";

type EditIngredientPageProps = {
	ingredientDto: IngredientDto;
	onSaved: (ingredientDto: IngredientDto) => void;
	onCancel: () => void;
};

const EditIngredientPage = ({
	ingredientDto,
	onSaved,
	onCancel,
}: EditIngredientPageProps) => {
	const queryClient = useQueryClient();
	const mutation = useMutation(
		createUpdateIngredientMutationOptions(queryClient),
	);

	const currentDefaultVariantId = ingredientDto.ingredientVariants.find(
		(variant) => variant.defaultVariant,
	)?.id;

	const form = useAppForm({
		defaultValues: createIngredientFormDefaultValues(
			{
				name: ingredientDto.name,
				weightToVolumeConversionFactor:
					ingredientDto.weightToVolumeConversionFactor,
				conversionWeightUnit: ingredientDto.conversionWeightUnit,
				conversionVolumeUnit: ingredientDto.conversionVolumeUnit,
			},
			currentDefaultVariantId,
		),
		validators: {
			onChange: ingredientFormSchema,
		},
		onSubmit: ({ value }) => {
			mutation.mutate(
				{
					ingredientId: ingredientDto.id,
					ingredientWriteRequest: toIngredientWriteRequest(value),
				},
				{ onSuccess: (updatedIngredientDto) => onSaved(updatedIngredientDto) },
			);
		},
	});

	return (
		<Box
			component="form"
			sx={{ mx: "auto", width: "100%", maxWidth: 640 }}
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				void form.handleSubmit();
			}}
		>
			<Stack spacing={3}>
				<IngredientForm
					form={form}
					variants={ingredientDto.ingredientVariants}
				/>

				{mutation.error !== null && (
					<Alert severity="error">{mutation.error.message}</Alert>
				)}

				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={1}
					sx={{
						alignItems: { xs: "stretch", sm: "center" },
						justifyContent: "flex-end",
					}}
				>
					<Button
						type="button"
						onClick={onCancel}
						disabled={mutation.isPending}
						sx={{ width: { xs: "100%", sm: "auto" } }}
					>
						Cancel
					</Button>
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<Button
								type="submit"
								variant="contained"
								disabled={!canSubmit || mutation.isPending}
								sx={{ width: { xs: "100%", sm: "auto" } }}
							>
								Save
							</Button>
						)}
					</form.Subscribe>
				</Stack>
			</Stack>
		</Box>
	);
};

export { EditIngredientPage };
