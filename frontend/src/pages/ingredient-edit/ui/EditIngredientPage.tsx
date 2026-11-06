import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	CustomUnitDto,
	IngredientDto,
	IngredientVariantDto,
} from "home-api";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	createDeleteIngredientMutationOptions,
	createIngredientMutationOptions,
	createUpdateIngredientMutationOptions,
	genericUnitDtoArray,
	sortCustomUnits,
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
import {
	type CustomUnitEditorHandle,
	type CustomUnitEditorState,
	CustomUnitForm,
} from "@/pages/ingredient-edit/ui/CustomUnitForm.tsx";
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
const EMPTY_CUSTOM_UNITS: CustomUnitDto[] = [];

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

const createDraftCustomUnit = (id: string): CustomUnitDto => ({
	id,
	name: "",
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
	const [deletedCustomUnitIds, setDeletedCustomUnitIds] = useState<Set<string>>(
		new Set(),
	);
	const [draftCustomUnits, setDraftCustomUnits] = useState<CustomUnitDto[]>([]);
	const draftIdCounter = useRef(0);
	const customUnitDraftIdCounter = useRef(0);
	const [variantStates, setVariantStates] = useState<
		Record<string, IngredientVariantEditorState>
	>({});
	const variantEditorRefs = useRef<
		Record<string, IngredientVariantEditorHandle | null>
	>({});
	const [customUnitStates, setCustomUnitStates] = useState<
		Record<string, CustomUnitEditorState>
	>({});
	const customUnitEditorRefs = useRef<
		Record<string, CustomUnitEditorHandle | null>
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
	const allCustomUnits = ingredientDto?.customUnits ?? EMPTY_CUSTOM_UNITS;
	const persistedCustomUnits = useMemo(
		() =>
			sortCustomUnits(
				allCustomUnits.filter(
					(customUnit) => !deletedCustomUnitIds.has(customUnit.id),
				),
			),
		[allCustomUnits, deletedCustomUnitIds],
	);
	const customUnits = useMemo(
		() => [...draftCustomUnits, ...persistedCustomUnits],
		[persistedCustomUnits, draftCustomUnits],
	);
	const draftCustomUnitIds = useMemo(
		() => new Set(draftCustomUnits.map((customUnit) => customUnit.id)),
		[draftCustomUnits],
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

	const handleCustomUnitStateChange = useCallback(
		(state: CustomUnitEditorState) => {
			setCustomUnitStates((currentStates) => {
				const previousState = currentStates[state.id];
				if (
					previousState?.name === state.name &&
					previousState?.conversionAmount === state.conversionAmount &&
					previousState?.conversionUnit === state.conversionUnit &&
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

	const clearCustomUnitEditorState = useCallback((unitId: string) => {
		setCustomUnitStates((currentStates) => {
			if (currentStates[unitId] === undefined) return currentStates;

			const nextStates = { ...currentStates };
			delete nextStates[unitId];
			return nextStates;
		});
		delete customUnitEditorRefs.current[unitId];
	}, []);

	const handleCustomUnitDeleted = useCallback(
		(unitId: string, isDraft: boolean) => {
			clearCustomUnitEditorState(unitId);
			if (isDraft) {
				setDraftCustomUnits((currentUnits) =>
					currentUnits.filter((customUnit) => customUnit.id !== unitId),
				);
				return;
			}

			setDeletedCustomUnitIds((currentIds) => {
				if (currentIds.has(unitId)) return currentIds;

				return new Set(currentIds).add(unitId);
			});
		},
		[clearCustomUnitEditorState],
	);

	const handleCustomUnitCreated = useCallback(
		(draftId: string) => {
			clearCustomUnitEditorState(draftId);
			setDraftCustomUnits((currentUnits) =>
				currentUnits.filter((customUnit) => customUnit.id !== draftId),
			);
		},
		[clearCustomUnitEditorState],
	);

	const registerCustomUnitEditor = useCallback(
		(unitId: string, editor: CustomUnitEditorHandle | null) => {
			customUnitEditorRefs.current[unitId] = editor;
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

	const duplicateCustomUnitIds = useMemo(() => {
		const names = new Map<string, string[]>();

		for (const customUnit of customUnits) {
			const name = (
				customUnitStates[customUnit.id]?.name ?? customUnit.name
			).trim();
			if (name === "") continue;

			const ids = names.get(name) ?? [];
			ids.push(customUnit.id);
			names.set(name, ids);
		}

		return new Set([...names.values()].filter((ids) => ids.length > 1).flat());
	}, [customUnitStates, customUnits]);

	const reservedCustomUnitIds = useMemo(() => {
		const genericUnitNames = new Set(
			genericUnitDtoArray.map((unit) => unit.toUpperCase()),
		);
		return new Set(
			customUnits
				.filter((customUnit) =>
					genericUnitNames.has(
						(customUnitStates[customUnit.id]?.name ?? customUnit.name)
							.trim()
							.toUpperCase(),
					),
				)
				.map((customUnit) => customUnit.id),
		);
	}, [customUnitStates, customUnits]);

	const occupiedCustomUnitNames = useMemo(() => {
		const owners = new Map(
			persistedCustomUnits.map((unit) => [unit.name.trim(), unit.id]),
		);
		const conflicts = new Map<string, string>();
		for (const unit of customUnits) {
			const name = (customUnitStates[unit.id]?.name ?? unit.name).trim();
			const ownerId = owners.get(name);
			if (ownerId !== undefined && ownerId !== unit.id) {
				conflicts.set(unit.id, name);
			}
		}
		return conflicts;
	}, [customUnits, customUnitStates, persistedCustomUnits]);

	const variantEditorsReady = variants.every(
		(variant) => variantStates[variant.id] !== undefined,
	);
	const dirtyVariantStates = variants
		.map((variant) => variantStates[variant.id])
		.filter(
			(state): state is IngredientVariantEditorState =>
				state?.isDirty || state?.isDraft === true,
		);
	const customUnitEditorsReady = customUnits.every(
		(customUnit) => customUnitStates[customUnit.id] !== undefined,
	);
	const dirtyCustomUnitStates = customUnits
		.map((customUnit) => customUnitStates[customUnit.id])
		.filter(
			(state): state is CustomUnitEditorState =>
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
	const customUnitNameTransitionConflict = useMemo(() => {
		const originalNames = new Map(
			customUnits.map((customUnit) => [customUnit.id, customUnit.name.trim()]),
		);
		const changedNameIds = dirtyCustomUnitStates
			.filter((state) => originalNames.get(state.id) !== state.name.trim())
			.map((state) => state.id);

		if (changedNameIds.length < 2) return false;

		const changedOriginalNames = new Set(
			changedNameIds.map((id) => originalNames.get(id)),
		);

		return dirtyCustomUnitStates.some((state) => {
			const originalName = originalNames.get(state.id);
			const nextName = state.name.trim();

			return (
				originalName !== nextName &&
				changedOriginalNames.has(nextName) &&
				changedNameIds.some(
					(id) => id !== state.id && originalNames.get(id) === nextName,
				)
			);
		});
	}, [customUnits, dirtyCustomUnitStates]);
	const customUnitTransitionError = customUnitNameTransitionConflict
		? "These custom unit name changes depend on save order. Save them one at a time."
		: undefined;
	const unsavedCount =
		(baseIsDirty ? 1 : 0) +
		dirtyVariantStates.length +
		dirtyCustomUnitStates.length;
	const hasInvalidDirtyEditor =
		(baseIsDirty && !baseCanSubmit) ||
		descriptionTransitionConflict ||
		customUnitNameTransitionConflict ||
		dirtyVariantStates.some(
			(state) => !state.canSubmit || duplicateVariantIds.has(state.id),
		) ||
		dirtyCustomUnitStates.some(
			(state) =>
				!state.canSubmit ||
				duplicateCustomUnitIds.has(state.id) ||
				occupiedCustomUnitNames.has(state.id) ||
				reservedCustomUnitIds.has(state.id),
		);
	const canSaveAll =
		variantEditorsReady &&
		customUnitEditorsReady &&
		unsavedCount > 0 &&
		!hasInvalidDirtyEditor &&
		!isSavingAll;
	const isSubmitting =
		isSavingAll ||
		activeMutation.isPending ||
		deleteMutation.isPending ||
		Object.values(variantStates).some((state) => state.isSubmitting) ||
		Object.values(customUnitStates).some((state) => state.isSubmitting);
	const handleAddVariant = useCallback(() => {
		const draftId = `draft-variant-${draftIdCounter.current}`;
		draftIdCounter.current += 1;
		setDraftVariants((currentVariants) => [
			...currentVariants,
			createDraftVariant(draftId),
		]);
	}, []);
	const handleAddCustomUnit = useCallback(() => {
		const draftId = `draft-custom-unit-${customUnitDraftIdCounter.current}`;
		customUnitDraftIdCounter.current += 1;
		setDraftCustomUnits((currentUnits) => [
			...currentUnits,
			createDraftCustomUnit(draftId),
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
		setDraftCustomUnits([]);
		form.reset(ingredientFormBaseline.current);
		for (const variant of persistedVariants) {
			variantEditorRefs.current[variant.id]?.reset();
		}
		for (const customUnit of persistedCustomUnits) {
			customUnitEditorRefs.current[customUnit.id]?.reset();
		}
	}, [
		activeMutation,
		form,
		isSubmitting,
		persistedCustomUnits,
		persistedVariants,
	]);

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
		const customUnitResults = await Promise.all(
			dirtyCustomUnitStates.map(async (state) => {
				const editor = customUnitEditorRefs.current[state.id];
				return editor === null || editor === undefined
					? false
					: editor.submit();
			}),
		);
		const variantsSaved = variantResults.every(Boolean);
		const customUnitsSaved = customUnitResults.every(Boolean);

		if (!variantsSaved || !customUnitsSaved) {
			setSaveAllError(
				[
					!variantsSaved &&
						"Some variant changes could not be saved. Review the highlighted variants.",
					!customUnitsSaved &&
						"Some custom unit changes could not be saved. Review the highlighted units.",
				]
					.filter(Boolean)
					.join(" "),
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
	}, [
		baseIsDirty,
		canSaveAll,
		dirtyCustomUnitStates,
		dirtyVariantStates,
		submitIngredientForm,
	]);

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
							customUnitTransitionError ??
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

					{props.mode === "edit" && (
						<Stack
							component="section"
							aria-labelledby="ingredient-custom-units-heading"
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
									id="ingredient-custom-units-heading"
									variant="h5"
									sx={{
										fontWeight: "fontWeightBold",
										typography: { xs: "body1", sm: "h5" },
									}}
								>
									Custom units
								</Typography>
								<AddButton
									label="Add custom unit"
									onClick={handleAddCustomUnit}
									disabled={isSubmitting}
								/>
							</Stack>
							{customUnits.map((customUnit) => (
								<CustomUnitForm
									key={customUnit.id}
									ref={(editor) =>
										registerCustomUnitEditor(customUnit.id, editor)
									}
									ingredientId={props.ingredientDto.id}
									customUnit={customUnit}
									isDraft={draftCustomUnitIds.has(customUnit.id)}
									duplicateName={duplicateCustomUnitIds.has(customUnit.id)}
									nameInUse={occupiedCustomUnitNames.get(customUnit.id)}
									reservedName={reservedCustomUnitIds.has(customUnit.id)}
									pageIsSubmitting={isSubmitting}
									onDeleted={() =>
										handleCustomUnitDeleted(
											customUnit.id,
											draftCustomUnitIds.has(customUnit.id),
										)
									}
									onCreated={() => handleCustomUnitCreated(customUnit.id)}
									onStateChange={handleCustomUnitStateChange}
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
