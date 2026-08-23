import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IngredientDto } from "home-api";
import { useState } from "react";
import {
	createDeleteIngredientMutationOptions,
	createIngredientMutationOptions,
	createUpdateIngredientMutationOptions,
} from "@/entities/ingredients";
import {
	createIngredientFormDefaultValues,
	toIngredientWriteRequest,
	useAppForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { DeleteIngredientDialog } from "@/pages/ingredient-edit/ui/DeleteIngredientDialog.tsx";
import { IngredientForm } from "@/pages/ingredient-edit/ui/IngredientForm.tsx";
import { IngredientFormActions } from "@/pages/ingredient-edit/ui/IngredientFormActions.tsx";

type EditIngredientPageProps = {
	mode: "edit" | "create";
	onCancel: () => void;
} & (
	| {
			mode: "edit";
			ingredientDto: IngredientDto;
			onDeleted: () => void;
	  }
	| {
			mode: "create";
			onCreated: (ingredientDto: IngredientDto) => void;
	  }
);

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

const EditIngredientPage = (props: EditIngredientPageProps) => {
	const queryClient = useQueryClient();
	const createMutation = useMutation(
		createIngredientMutationOptions(queryClient),
	);
	const updateMutation = useMutation(
		createUpdateIngredientMutationOptions(queryClient),
	);
	const deleteMutation = useMutation(
		createDeleteIngredientMutationOptions(queryClient),
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const activeMutation =
		props.mode === "create" ? createMutation : updateMutation;
	const ingredientDto = props.mode === "edit" ? props.ingredientDto : undefined;
	const isSubmitting = activeMutation.isPending || deleteMutation.isPending;

	const handleDeleteCancel = () => {
		if (deleteMutation.isPending) return;

		deleteMutation.reset();
		setDeleteDialogOpen(false);
	};

	const handleDelete = () => {
		if (props.mode === "edit") {
			deleteMutation.reset();
			setDeleteDialogOpen(true);
		}
	};

	const form = useAppForm({
		defaultValues:
			ingredientDto === undefined
				? createIngredientFormDefaultValues()
				: createFormDefaultValues(ingredientDto),
		validators: {
			onChange: ingredientFormSchema,
		},
		onSubmit: ({ formApi, value }) => {
			const ingredientWriteRequest = toIngredientWriteRequest(value);

			if (props.mode === "create") {
				createMutation.mutate(ingredientWriteRequest, {
					onSuccess: (createdIngredientDto) => {
						props.onCreated(createdIngredientDto);
					},
				});
				return;
			}

			updateMutation.mutate(
				{
					ingredientId: props.ingredientDto.id,
					ingredientWriteRequest,
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
		<>
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
						onCancel={props.onCancel}
						onDelete={props.mode === "edit" ? handleDelete : undefined}
						onReset={() => activeMutation.reset()}
						isSubmitting={isSubmitting}
						errorMessage={activeMutation.error?.message}
					/>

					<IngredientForm
						form={form}
						variants={ingredientDto?.ingredientVariants ?? []}
					/>
				</Stack>
			</Box>
			{ingredientDto !== undefined && (
				<DeleteIngredientDialog
					ingredientName={ingredientDto.name}
					open={deleteDialogOpen}
					isDeleting={deleteMutation.isPending}
					errorMessage={deleteMutation.error?.message}
					onCancel={handleDeleteCancel}
					onConfirm={() => {
						deleteMutation.mutate(ingredientDto.id, {
							onSuccess: () => {
								if (props.mode === "edit") props.onDeleted();
							},
						});
					}}
				/>
			)}
		</>
	);
};

export { EditIngredientPage };
