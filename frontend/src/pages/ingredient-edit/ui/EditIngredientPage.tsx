import Box from "@mui/material/Box";
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
import { IngredientFormActions } from "@/pages/ingredient-edit/ui/IngredientFormActions.tsx";

type EditIngredientPageProps = {
	ingredientDto: IngredientDto;
	onCancel: () => void;
};

const createFormDefaultValues = (ingredientDto: IngredientDto) => {
	const currentDefaultVariantId = ingredientDto.ingredientVariants.find(
		(variant) => variant.defaultVariant,
	)?.id;

	return createIngredientFormDefaultValues(
		{
			name: ingredientDto.name,
			weightToVolumeConversionFactor:
				ingredientDto.weightToVolumeConversionFactor,
			conversionWeightUnit: ingredientDto.conversionWeightUnit,
			conversionVolumeUnit: ingredientDto.conversionVolumeUnit,
		},
		currentDefaultVariantId,
	);
};

const EditIngredientPage = ({
	ingredientDto,
	onCancel,
}: EditIngredientPageProps) => {
	const queryClient = useQueryClient();
	const mutation = useMutation(
		createUpdateIngredientMutationOptions(queryClient),
	);

	const form = useAppForm({
		defaultValues: createFormDefaultValues(ingredientDto),
		validators: {
			onChange: ingredientFormSchema,
		},
		onSubmit: ({ formApi, value }) => {
			mutation.mutate(
				{
					ingredientId: ingredientDto.id,
					ingredientWriteRequest: toIngredientWriteRequest(value),
				},
				{
					onSuccess: (updatedIngredientDto) => {
						formApi.reset(createFormDefaultValues(updatedIngredientDto));
					},
				},
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
				<IngredientFormActions
					form={form}
					onCancel={onCancel}
					onReset={() => mutation.reset()}
					isSubmitting={mutation.isPending}
					errorMessage={mutation.error?.message}
				/>

				<IngredientForm
					form={form}
					variants={ingredientDto.ingredientVariants}
				/>
			</Stack>
		</Box>
	);
};

export { EditIngredientPage };
