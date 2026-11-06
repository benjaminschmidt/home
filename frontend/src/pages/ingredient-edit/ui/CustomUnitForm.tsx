import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import { useSelector } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CustomUnitDto } from "home-api";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	createCustomUnitMutationOptions,
	createDeleteCustomUnitMutationOptions,
	createUpdateCustomUnitMutationOptions,
} from "@/entities/ingredients";
import {
	createCustomUnitConversionUnitItems,
	createCustomUnitFormDefaultValues,
	toCustomUnitWriteRequest,
} from "@/pages/ingredient-edit/model/customUnitForm.ts";
import { customUnitFormSchema } from "@/pages/ingredient-edit/model/customUnitFormSchema.ts";
import { useAppForm } from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { DeleteCustomUnitDialog } from "@/pages/ingredient-edit/ui/DeleteCustomUnitDialog.tsx";
import { DeleteButton, SaveButton } from "@/shared/ui/button";
import { CardHeader } from "@/shared/ui/card";
import { SelectField, TextField } from "@/shared/ui/form";

type CustomUnitEditorState = {
	id: string;
	name: string;
	conversionAmount: string;
	conversionUnit: string;
	isDraft: boolean;
	isDirty: boolean;
	canSubmit: boolean;
	isSubmitting: boolean;
	errorMessage?: string;
};

type CustomUnitEditorHandle = {
	submit: () => Promise<boolean>;
	reset: () => void;
};

type CustomUnitFormProps = {
	ingredientId: string;
	customUnit: CustomUnitDto;
	isDraft?: boolean;
	duplicateName: boolean;
	nameInUse?: string;
	reservedName: boolean;
	pageIsSubmitting: boolean;
	onDeleted: () => void;
	onCreated?: (customUnit: CustomUnitDto) => void;
	onStateChange: (state: CustomUnitEditorState) => void;
};

const CustomUnitForm = forwardRef<CustomUnitEditorHandle, CustomUnitFormProps>(
	(
		{
			ingredientId,
			customUnit,
			isDraft = false,
			duplicateName,
			nameInUse,
			reservedName,
			pageIsSubmitting,
			onDeleted,
			onCreated,
			onStateChange,
		},
		ref,
	) => {
		const queryClient = useQueryClient();
		const [baselineCustomUnit, setBaselineCustomUnit] = useState(customUnit);
		const lastReceivedCustomUnit = useRef(customUnit);
		const [formVersion, setFormVersion] = useState(0);
		const updateMutation = useMutation(
			createUpdateCustomUnitMutationOptions(queryClient),
		);
		const createMutation = useMutation(
			createCustomUnitMutationOptions(queryClient),
		);
		const deleteMutation = useMutation(
			createDeleteCustomUnitMutationOptions(queryClient),
		);
		const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
		const lastSubmissionSucceeded = useRef(false);
		const form = useAppForm({
			formId: `custom-unit-${customUnit.id}-${formVersion}`,
			defaultValues: createCustomUnitFormDefaultValues(baselineCustomUnit),
			validators: {
				onChange: customUnitFormSchema,
			},
			onSubmit: async ({ value }) => {
				const customUnitWriteRequest = toCustomUnitWriteRequest(value);
				const savedCustomUnit = isDraft
					? await createMutation.mutateAsync({
							ingredientId,
							customUnitWriteRequest,
						})
					: await updateMutation.mutateAsync({
							ingredientId,
							unitId: customUnit.id,
							customUnitWriteRequest,
						});

				setBaselineCustomUnit(savedCustomUnit);
				setFormVersion((currentVersion) => currentVersion + 1);
				lastSubmissionSucceeded.current = true;
				if (isDraft) onCreated?.(savedCustomUnit);
			},
		});

		const name = useSelector(form.store, (state) => state.values.name);
		const conversionAmount = useSelector(
			form.store,
			(state) => state.values.conversionAmount,
		);
		const conversionUnit = useSelector(
			form.store,
			(state) => state.values.conversionUnit,
		);
		const isDirty = useSelector(form.store, (state) => state.isDirty);
		const canSubmit = useSelector(form.store, (state) => state.canSubmit);
		const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);
		const customUnitIsSubmitting =
			isSubmitting ||
			createMutation.isPending ||
			updateMutation.isPending ||
			deleteMutation.isPending;
		const inputsDisabled = pageIsSubmitting || customUnitIsSubmitting;
		const mutationError = isDraft ? createMutation.error : updateMutation.error;

		useEffect(() => {
			if (
				isDraft ||
				customUnitIsSubmitting ||
				lastReceivedCustomUnit.current === customUnit
			)
				return;

			lastReceivedCustomUnit.current = customUnit;
			setBaselineCustomUnit(customUnit);
			if (!form.state.isDirty) {
				form.reset(createCustomUnitFormDefaultValues(customUnit));
			}
		}, [customUnit, customUnitIsSubmitting, form, isDraft]);

		const nameError = duplicateName
			? "Name must be unique for this ingredient"
			: reservedName
				? "Name must be different from a built-in unit"
				: nameInUse !== undefined
					? `The name "${nameInUse}" is still saved for another unit. Rename or delete that unit first.`
					: undefined;

		useEffect(() => {
			onStateChange({
				id: customUnit.id,
				name,
				conversionAmount,
				conversionUnit,
				isDraft,
				isDirty,
				canSubmit,
				isSubmitting: customUnitIsSubmitting,
				errorMessage: mutationError?.message,
			});
		}, [
			canSubmit,
			conversionAmount,
			conversionUnit,
			customUnit.id,
			customUnitIsSubmitting,
			isDirty,
			isDraft,
			mutationError?.message,
			name,
			onStateChange,
		]);

		const submit = useCallback(async () => {
			if (duplicateName || reservedName || nameInUse !== undefined)
				return false;

			lastSubmissionSucceeded.current = false;
			try {
				await form.handleSubmit();
				return lastSubmissionSucceeded.current;
			} catch {
				return false;
			}
		}, [duplicateName, form, nameInUse, reservedName]);

		const reset = useCallback(() => {
			updateMutation.reset();
			createMutation.reset();
			form.reset(createCustomUnitFormDefaultValues(baselineCustomUnit));
		}, [baselineCustomUnit, createMutation, form, updateMutation]);

		const handleDeleteCancel = useCallback(() => {
			if (deleteMutation.isPending) return;

			deleteMutation.reset();
			setDeleteDialogOpen(false);
		}, [deleteMutation]);

		const handleDelete = useCallback(() => {
			if (pageIsSubmitting || customUnitIsSubmitting) return;
			if (isDraft) {
				onDeleted();
				return;
			}

			deleteMutation.reset();
			setDeleteDialogOpen(true);
		}, [
			customUnitIsSubmitting,
			deleteMutation,
			isDraft,
			onDeleted,
			pageIsSubmitting,
		]);

		useImperativeHandle(ref, () => ({ submit, reset }), [reset, submit]);

		return (
			<>
				<Card
					component="form"
					aria-label={`Ingredient custom unit: ${name.trim() || "Custom unit"}`}
					variant="outlined"
					sx={{ overflow: "hidden", width: "100%" }}
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void submit();
					}}
				>
					<CardHeader
						title={name.trim() || "Custom unit"}
						forceCompact
						action={
							<Stack direction="row" spacing={0.5}>
								<SaveButton
									disabled={
										!isDirty ||
										!canSubmit ||
										duplicateName ||
										reservedName ||
										nameInUse !== undefined ||
										pageIsSubmitting ||
										customUnitIsSubmitting
									}
								/>
								<DeleteButton
									onClick={handleDelete}
									disabled={pageIsSubmitting || customUnitIsSubmitting}
								/>
							</Stack>
						}
					/>
					<CardContent sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
						<Stack spacing={3}>
							<form.AppField name="name">
								{(field) => (
									<TextField
										disabled={inputsDisabled}
										label="Name"
										value={field.state.value}
										handleChange={field.handleChange}
										errorMessage={
											nameError ?? field.state.meta.errors[0]?.message
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
								<form.AppField name="conversionAmount">
									{(field) => (
										<TextField
											disabled={inputsDisabled}
											label="Amount for 1 custom unit"
											inputMode="decimal"
											value={field.state.value}
											handleChange={field.handleChange}
											errorMessage={field.state.meta.errors[0]?.message}
										/>
									)}
								</form.AppField>
								<form.AppField name="conversionUnit">
									{(field) => {
										const errorMessage = field.state.meta.errors[0]?.message;

										return (
											<Stack spacing={0.5}>
												<SelectField
													disabled={inputsDisabled}
													label="Conversion unit"
													value={field.state.value}
													handleChange={field.handleChange}
													items={createCustomUnitConversionUnitItems()}
												/>
												{errorMessage !== undefined && (
													<FormHelperText error>{errorMessage}</FormHelperText>
												)}
											</Stack>
										);
									}}
								</form.AppField>
							</Box>
						</Stack>
					</CardContent>
					{mutationError?.message !== undefined && (
						<Alert severity="error" variant="outlined" sx={{ mx: 2, mb: 1 }}>
							{mutationError.message}
						</Alert>
					)}
				</Card>
				{!isDraft && (
					<DeleteCustomUnitDialog
						unitName={baselineCustomUnit.name.trim() || "Custom unit"}
						open={deleteDialogOpen}
						isDeleting={deleteMutation.isPending}
						errorMessage={deleteMutation.error?.message}
						onCancel={handleDeleteCancel}
						onConfirm={() => {
							deleteMutation.mutate(
								{ ingredientId, unitId: customUnit.id },
								{ onSuccess: onDeleted },
							);
						}}
					/>
				)}
			</>
		);
	},
);

CustomUnitForm.displayName = "CustomUnitForm";

export type { CustomUnitEditorHandle, CustomUnitEditorState };
export { CustomUnitForm };
