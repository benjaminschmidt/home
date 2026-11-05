import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IngredientDto, IngredientVariantDto } from "home-api";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	createDeleteIngredientMutationOptions,
	createIngredientMutationOptions,
	createUpdateIngredientMutationOptions,
	sortIngredientVariants,
} from "@/entities/ingredients";
import {
	createIngredientFormDefaultValues,
	toIngredientWriteRequest,
	useAppForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import {
	ingredientFormSchema,
	NO_DEFAULT_VARIANT,
} from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { DeleteIngredientDialog } from "@/pages/ingredient-edit/ui/DeleteIngredientDialog.tsx";
import { IngredientBaseForm } from "@/pages/ingredient-edit/ui/IngredientBaseForm.tsx";
import { IngredientFormActions } from "@/pages/ingredient-edit/ui/IngredientFormActions.tsx";
import {
	type IngredientVariantEditorHandle,
	type IngredientVariantEditorState,
	IngredientVariantForm,
} from "@/pages/ingredient-edit/ui/IngredientVariantForm.tsx";
import { AddButton } from "@/shared/ui/button";

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

const EMPTY_VARIANTS: IngredientVariantDto[] = [];

const createFormDefaultValues = (ingredientDto: IngredientDto) => {
	const currentDefaultVariantId = ingredientDto.ingredientVariants.find(
		(variant) => variant.defaultVariant,
	)?.id;

	return createIngredientFormDefaultValues(
		{
			name: ingredientDto.name,
			conversionWeightAmount: ingredientDto.conversionWeightAmount,
			conversionVolumeAmount: ingredientDto.conversionVolumeAmount,
			conversionWeightUnit: ingredientDto.conversionWeightUnit,
			conversionVolumeUnit: ingredientDto.conversionVolumeUnit,
		},
		currentDefaultVariantId,
	);
};

const createDraftVariant = (id: string): IngredientVariantDto => ({
	id,
	description: "",
	defaultVariant: false,
});

const EditIngredientPageContent = (props: EditIngredientPageProps) => {
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
	const [isSavingAll, setIsSavingAll] = useState(false);
	const [saveAllError, setSaveAllError] = useState<string>();
	const [deletedVariantIds, setDeletedVariantIds] = useState<Set<string>>(
		new Set(),
	);
	const [draftVariants, setDraftVariants] = useState<IngredientVariantDto[]>(
		[],
	);
	const draftIdCounter = useRef(0);
	const [variantStates, setVariantStates] = useState<
		Record<string, IngredientVariantEditorState>
	>({});
	const variantEditorRefs = useRef<
		Record<string, IngredientVariantEditorHandle | null>
	>({});
	const activeMutation =
		props.mode === "create" ? createMutation : updateMutation;
	const ingredientDto = props.mode === "edit" ? props.ingredientDto : undefined;
	const allVariants = ingredientDto?.ingredientVariants ?? EMPTY_VARIANTS;
	const persistedVariants = useMemo(
		() =>
			sortIngredientVariants(
				allVariants.filter((variant) => !deletedVariantIds.has(variant.id)),
			),
		[allVariants, deletedVariantIds],
	);
	const variants = useMemo(
		() => [...draftVariants, ...persistedVariants],
		[persistedVariants, draftVariants],
	);
	const draftVariantIds = useMemo(
		() => new Set(draftVariants.map((variant) => variant.id)),
		[draftVariants],
	);
	const initialIngredientFormValues =
		ingredientDto === undefined
			? createIngredientFormDefaultValues()
			: createFormDefaultValues(ingredientDto);
	const ingredientFormBaseline = useRef(initialIngredientFormValues);

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
		defaultValues: ingredientFormBaseline.current,
		validators: {
			onChange: ingredientFormSchema,
		},
		onSubmit: async ({ formApi, value }) => {
			const ingredientWriteRequest = toIngredientWriteRequest(value);

			if (props.mode === "create") {
				const createdIngredientDto = await createMutation.mutateAsync(
					ingredientWriteRequest,
				);
				props.onCreated(createdIngredientDto);
				return;
			}

			const updatedIngredientDto = await updateMutation.mutateAsync({
				ingredientId: props.ingredientDto.id,
				ingredientWriteRequest,
			});
			const updatedFormValues = createFormDefaultValues(updatedIngredientDto);
			ingredientFormBaseline.current = updatedFormValues;
			formApi.reset(updatedFormValues);
		},
	});

	const baseIsDirty = useSelector(form.store, (state) => state.isDirty);
	const baseCanSubmit = useSelector(form.store, (state) => state.canSubmit);

	const handleVariantStateChange = useCallback(
		(state: IngredientVariantEditorState) => {
			setVariantStates((currentStates) => {
				const previousState = currentStates[state.id];
				if (
					previousState?.description === state.description &&
					previousState?.isDraft === state.isDraft &&
					previousState?.isDirty === state.isDirty &&
					previousState?.canSubmit === state.canSubmit &&
					previousState?.isSubmitting === state.isSubmitting &&
					previousState?.errorMessage === state.errorMessage
				) {
					return currentStates;
				}

				return { ...currentStates, [state.id]: state };
			});
		},
		[],
	);

	const clearVariantEditorState = useCallback((variantId: string) => {
		setVariantStates((currentStates) => {
			if (currentStates[variantId] === undefined) return currentStates;

			const nextStates = { ...currentStates };
			delete nextStates[variantId];
			return nextStates;
		});
		delete variantEditorRefs.current[variantId];
	}, []);

	const handleVariantDeleted = useCallback(
		(variantId: string, isDraft: boolean) => {
			clearVariantEditorState(variantId);
			if (isDraft) {
				setDraftVariants((currentVariants) =>
					currentVariants.filter((variant) => variant.id !== variantId),
				);
				return;
			}

			setDeletedVariantIds((currentIds) => {
				if (currentIds.has(variantId)) return currentIds;

				return new Set(currentIds).add(variantId);
			});
			if (ingredientFormBaseline.current.defaultVariantId === variantId) {
				ingredientFormBaseline.current = {
					...ingredientFormBaseline.current,
					defaultVariantId: NO_DEFAULT_VARIANT,
				};
			}
			if (form.getFieldValue("defaultVariantId") === variantId) {
				form.setFieldValue("defaultVariantId", NO_DEFAULT_VARIANT);
			}
		},
		[clearVariantEditorState, form],
	);

	const handleVariantCreated = useCallback(
		(draftId: string) => {
			clearVariantEditorState(draftId);
			setDraftVariants((currentVariants) =>
				currentVariants.filter((variant) => variant.id !== draftId),
			);
		},
		[clearVariantEditorState],
	);

	const registerVariantEditor = useCallback(
		(variantId: string, editor: IngredientVariantEditorHandle | null) => {
			variantEditorRefs.current[variantId] = editor;
		},
		[],
	);

	const duplicateVariantIds = useMemo(() => {
		const descriptions = new Map<string, string[]>();

		for (const variant of variants) {
			const description = (
				variantStates[variant.id]?.description ?? variant.description
			).trim();
			if (description === "") continue;

			const ids = descriptions.get(description) ?? [];
			ids.push(variant.id);
			descriptions.set(description, ids);
		}

		return new Set(
			[...descriptions.values()].filter((ids) => ids.length > 1).flat(),
		);
	}, [variantStates, variants]);

	const variantEditorsReady = variants.every(
		(variant) => variantStates[variant.id] !== undefined,
	);
	const dirtyVariantStates = variants
		.map((variant) => variantStates[variant.id])
		.filter(
			(state): state is IngredientVariantEditorState =>
				state?.isDirty || state?.isDraft === true,
		);
	const descriptionTransitionConflict = useMemo(() => {
		const originalDescriptions = new Map(
			variants.map((variant) => [variant.id, variant.description.trim()]),
		);
		const changedDescriptionIds = dirtyVariantStates
			.filter(
				(state) =>
					originalDescriptions.get(state.id) !== state.description.trim(),
			)
			.map((state) => state.id);

		if (changedDescriptionIds.length < 2) return false;

		const changedOriginalDescriptions = new Set(
			changedDescriptionIds.map((id) => originalDescriptions.get(id)),
		);

		return dirtyVariantStates.some((state) => {
			const originalDescription = originalDescriptions.get(state.id);
			const nextDescription = state.description.trim();

			return (
				originalDescription !== nextDescription &&
				changedOriginalDescriptions.has(nextDescription) &&
				changedDescriptionIds.some(
					(id) =>
						id !== state.id && originalDescriptions.get(id) === nextDescription,
				)
			);
		});
	}, [dirtyVariantStates, variants]);
	const descriptionTransitionError = descriptionTransitionConflict
		? "These variant description changes depend on save order. Save them one at a time."
		: undefined;
	const unsavedCount = (baseIsDirty ? 1 : 0) + dirtyVariantStates.length;
	const hasInvalidDirtyEditor =
		(baseIsDirty && !baseCanSubmit) ||
		descriptionTransitionConflict ||
		dirtyVariantStates.some(
			(state) => !state.canSubmit || duplicateVariantIds.has(state.id),
		);
	const canSaveAll =
		variantEditorsReady &&
		unsavedCount > 0 &&
		!hasInvalidDirtyEditor &&
		!isSavingAll;
	const isSubmitting =
		isSavingAll ||
		activeMutation.isPending ||
		deleteMutation.isPending ||
		Object.values(variantStates).some((state) => state.isSubmitting);
	const handleAddVariant = useCallback(() => {
		const draftId = `draft-variant-${draftIdCounter.current}`;
		draftIdCounter.current += 1;
		setDraftVariants((currentVariants) => [
			...currentVariants,
			createDraftVariant(draftId),
		]);
	}, []);

	const submitIngredientForm = useCallback(async () => {
		try {
			await form.handleSubmit();
			return form.state.isSubmitSuccessful;
		} catch {
			return false;
		}
	}, [form]);

	const handleDiscardAll = useCallback(() => {
		if (isSubmitting) return;

		setSaveAllError(undefined);
		activeMutation.reset();
		setDraftVariants([]);
		form.reset(ingredientFormBaseline.current);
		for (const variant of persistedVariants) {
			variantEditorRefs.current[variant.id]?.reset();
		}
	}, [activeMutation, form, isSubmitting, persistedVariants]);

	const handleSaveAll = useCallback(async () => {
		if (!canSaveAll) return;

		setIsSavingAll(true);
		setSaveAllError(undefined);

		const variantResults = await Promise.all(
			dirtyVariantStates.map(async (state) => {
				const editor = variantEditorRefs.current[state.id];
				return editor === null || editor === undefined
					? false
					: editor.submit();
			}),
		);
		const variantsSaved = variantResults.every(Boolean);

		if (!variantsSaved) {
			setSaveAllError(
				"Some variant changes could not be saved. Review the highlighted variants.",
			);
			setIsSavingAll(false);
			return;
		}

		if (baseIsDirty) {
			const ingredientSaved = await submitIngredientForm();
			if (!ingredientSaved) {
				setSaveAllError(
					"The ingredient changes could not be saved. Review the ingredient form.",
				);
			}
		}

		setIsSavingAll(false);
	}, [baseIsDirty, canSaveAll, dirtyVariantStates, submitIngredientForm]);

	return (
		<>
			<Box sx={{ mx: "auto", width: "100%", maxWidth: 640 }}>
				<Stack spacing={3}>
					<IngredientFormActions
						canSaveAll={canSaveAll}
						onCancel={props.onCancel}
						onDelete={props.mode === "edit" ? handleDelete : undefined}
						onDiscardAll={handleDiscardAll}
						onSaveAll={() => void handleSaveAll()}
						isSubmitting={isSubmitting}
						errorMessage={
							saveAllError ??
							descriptionTransitionError ??
							activeMutation.error?.message
						}
						unsavedCount={unsavedCount}
					/>

					<IngredientBaseForm
						form={form}
						variants={persistedVariants}
						onSubmit={() => void submitIngredientForm()}
						isSubmitting={isSubmitting}
					/>

					{props.mode === "edit" && (
						<Stack
							component="section"
							aria-labelledby="ingredient-variants-heading"
							spacing={1.5}
						>
							<Stack
								direction="row"
								sx={{
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Typography
									id="ingredient-variants-heading"
									variant="h5"
									sx={{
										fontWeight: "fontWeightBold",
										typography: { xs: "body1", sm: "h5" },
									}}
								>
									Variants
								</Typography>
								<AddButton
									label="Add variant"
									onClick={handleAddVariant}
									disabled={isSubmitting}
								/>
							</Stack>
							{variants.map((variant) => (
								<IngredientVariantForm
									key={variant.id}
									ref={(editor) => registerVariantEditor(variant.id, editor)}
									ingredientId={props.ingredientDto.id}
									variant={variant}
									isDraft={draftVariantIds.has(variant.id)}
									duplicateDescription={duplicateVariantIds.has(variant.id)}
									pageIsSubmitting={isSubmitting}
									onDeleted={() =>
										handleVariantDeleted(
											variant.id,
											draftVariantIds.has(variant.id),
										)
									}
									onCreated={() => handleVariantCreated(variant.id)}
									onStateChange={handleVariantStateChange}
								/>
							))}
						</Stack>
					)}
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

const EditIngredientPage = (props: EditIngredientPageProps) => {
	const editorKey = props.mode === "edit" ? props.ingredientDto.id : "create";

	return <EditIngredientPageContent key={editorKey} {...props} />;
};

export { EditIngredientPage };
