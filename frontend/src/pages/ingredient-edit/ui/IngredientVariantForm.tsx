import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useSelector } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IngredientVariantDto } from "home-api";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	createDeleteIngredientVariantMutationOptions,
	createUpdateIngredientVariantMutationOptions,
} from "@/entities/ingredients";
import { useAppForm } from "@/pages/ingredient-edit/model/ingredientForm.ts";
import {
	createIngredientVariantFormDefaultValues,
	createIngredientVariantUnitItems,
	toIngredientVariantWriteRequest,
} from "@/pages/ingredient-edit/model/ingredientVariantForm.ts";
import { ingredientVariantFormSchema } from "@/pages/ingredient-edit/model/ingredientVariantFormSchema.ts";
import { DeleteIngredientVariantDialog } from "@/pages/ingredient-edit/ui/DeleteIngredientVariantDialog.tsx";
import { DeleteButton, SaveButton } from "@/shared/ui/button";
import { CardHeader } from "@/shared/ui/card";
import { SelectField, TextField } from "@/shared/ui/form";

type IngredientVariantEditorState = {
	id: string;
	description: string;
	isDirty: boolean;
	canSubmit: boolean;
	isSubmitting: boolean;
	errorMessage?: string;
};

type IngredientVariantEditorHandle = {
	submit: () => Promise<boolean>;
	reset: () => void;
};

type IngredientVariantFormProps = {
	ingredientId: string;
	variant: IngredientVariantDto;
	duplicateDescription: boolean;
	pageIsSubmitting: boolean;
	onDeleted: () => void;
	onStateChange: (state: IngredientVariantEditorState) => void;
};

const IngredientVariantForm = forwardRef<
	IngredientVariantEditorHandle,
	IngredientVariantFormProps
>(
	(
		{
			ingredientId,
			variant,
			duplicateDescription,
			pageIsSubmitting,
			onDeleted,
			onStateChange,
		},
		ref,
	) => {
		const queryClient = useQueryClient();
		const [baselineVariant, setBaselineVariant] = useState(variant);
		const [formVersion, setFormVersion] = useState(0);
		const updateMutation = useMutation(
			createUpdateIngredientVariantMutationOptions(queryClient),
		);
		const deleteMutation = useMutation(
			createDeleteIngredientVariantMutationOptions(queryClient),
		);
		const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
		const lastSubmissionSucceeded = useRef(false);
		const form = useAppForm({
			formId: `ingredient-variant-${variant.id}-${formVersion}`,
			defaultValues: createIngredientVariantFormDefaultValues(baselineVariant),
			validators: {
				onChange: ingredientVariantFormSchema,
			},
			onSubmit: async ({ value }) => {
				const updatedVariant = await updateMutation.mutateAsync({
					ingredientId,
					variantId: variant.id,
					ingredientVariantWriteRequest: toIngredientVariantWriteRequest(value),
				});

				setBaselineVariant(updatedVariant);
				setFormVersion((currentVersion) => currentVersion + 1);
				lastSubmissionSucceeded.current = true;
			},
		});

		const description = useSelector(
			form.store,
			(state) => state.values.description,
		);
		const isDirty = useSelector(form.store, (state) => state.isDirty);
		const canSubmit = useSelector(form.store, (state) => state.canSubmit);
		const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);
		const variantIsSubmitting = isSubmitting || deleteMutation.isPending;
		const inputsDisabled = pageIsSubmitting || variantIsSubmitting;

		useEffect(() => {
			onStateChange({
				id: variant.id,
				description,
				isDirty,
				canSubmit,
				isSubmitting: variantIsSubmitting,
				errorMessage: updateMutation.error?.message,
			});
		}, [
			canSubmit,
			description,
			isDirty,
			variantIsSubmitting,
			onStateChange,
			updateMutation.error?.message,
			variant.id,
		]);

		const submit = useCallback(async () => {
			if (duplicateDescription) return false;

			lastSubmissionSucceeded.current = false;
			try {
				await form.handleSubmit();
				return lastSubmissionSucceeded.current;
			} catch {
				return false;
			}
		}, [duplicateDescription, form]);

		const reset = useCallback(() => {
			updateMutation.reset();
			form.reset();
		}, [form, updateMutation]);

		const handleDeleteCancel = useCallback(() => {
			if (deleteMutation.isPending) return;

			deleteMutation.reset();
			setDeleteDialogOpen(false);
		}, [deleteMutation]);

		const handleDelete = useCallback(() => {
			if (pageIsSubmitting || variantIsSubmitting) return;

			deleteMutation.reset();
			setDeleteDialogOpen(true);
		}, [deleteMutation, pageIsSubmitting, variantIsSubmitting]);

		useImperativeHandle(ref, () => ({ submit, reset }), [reset, submit]);

		return (
			<>
				<Card
					component="form"
					aria-label={`Ingredient variant: ${description.trim() || "Variant"}`}
					variant="outlined"
					sx={{ overflow: "hidden", width: "100%" }}
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void submit();
					}}
				>
					<CardHeader
						title={description.trim() || "Variant"}
						forceCompact
						action={
							<Stack direction="row" spacing={0.5}>
								<SaveButton
									disabled={
										!isDirty ||
										!canSubmit ||
										duplicateDescription ||
										pageIsSubmitting ||
										variantIsSubmitting
									}
								/>
								<DeleteButton
									onClick={handleDelete}
									disabled={pageIsSubmitting || variantIsSubmitting}
								/>
							</Stack>
						}
					/>
					<CardContent sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
						<Stack spacing={3}>
							<form.AppField name="description">
								{(field) => (
									<TextField
										disabled={inputsDisabled}
										label="Description"
										value={field.state.value}
										handleChange={field.handleChange}
										errorMessage={
											duplicateDescription
												? "Description must be unique for this ingredient"
												: field.state.meta.errors[0]?.message
										}
									/>
								)}
							</form.AppField>

							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "minmax(0, 1fr)",
										sm: "minmax(0, 1fr) minmax(0, 1fr)",
									},
									gap: 2,
								}}
							>
								<form.AppField name="servingSize">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Serving size"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="unit">
									{(field) => (
										<SelectField
											disabled={inputsDisabled}
											label="Unit"
											value={field.state.value}
											handleChange={field.handleChange}
											items={createIngredientVariantUnitItems()}
										/>
									)}
								</form.AppField>
							</Box>

							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: {
										xs: "minmax(0, 1fr)",
										sm: "repeat(2, minmax(0, 1fr))",
									},
									gap: 2,
								}}
							>
								<form.AppField name="calories">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Calories"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="carbohydrate">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Carbohydrates"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="fat">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Fat"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="protein">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Protein"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="saturatedFat">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Saturated fat"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="sodium">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Sodium"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="sugar">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Sugar"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
							</Box>
						</Stack>
					</CardContent>
					{updateMutation.error?.message !== undefined && (
						<Alert severity="error" variant="outlined" sx={{ mx: 2, mb: 1 }}>
							{updateMutation.error.message}
						</Alert>
					)}
				</Card>
				<DeleteIngredientVariantDialog
					variantDescription={variant.description.trim() || "Variant"}
					open={deleteDialogOpen}
					isDeleting={deleteMutation.isPending}
					errorMessage={deleteMutation.error?.message}
					onCancel={handleDeleteCancel}
					onConfirm={() => {
						deleteMutation.mutate(
							{ ingredientId, variantId: variant.id },
							{ onSuccess: onDeleted },
						);
					}}
				/>
			</>
		);
	},
);

IngredientVariantForm.displayName = "IngredientVariantForm";

export type { IngredientVariantEditorHandle, IngredientVariantEditorState };
export { IngredientVariantForm };
