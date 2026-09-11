import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
	calculateConversionFactorFromUnitToUnit,
	getUnitOptions,
	type Ingredient,
} from "@/entities/ingredients";
import { CancelButton, ResetButton, SubmitButton } from "@/shared/ui/button";
import { SelectField, type SelectFieldItem, TextField } from "@/shared/ui/form";

type ServingDialogProps = {
	ingredient: Ingredient;
	servingSize: number;
	unit: string;
	onClose: () => void;
	onApply: (next: { servingSize?: number; unit?: string }) => void;
};

const servingSizeSchema = z.string().transform((draftServingSize, context) => {
	const trimmedServingSize = draftServingSize.trim();
	if (trimmedServingSize === "") return undefined;

	const servingSize = Number(trimmedServingSize);
	if (!Number.isFinite(servingSize) || servingSize <= 0) {
		context.addIssue({
			code: "custom",
			message: "Amount must be a number greater than 0",
		});
		return z.NEVER;
	}

	return servingSize;
});

const servingFormSchema = z.object({
	servingSize: servingSizeSchema,
	unit: z.string(),
});

const formatDraftServingSize = (servingSize: number) =>
	`${Number(servingSize.toPrecision(12))}`;

const ServingDialog = ({
	ingredient,
	servingSize,
	unit,
	onClose,
	onApply,
}: ServingDialogProps) => {
	const form = useForm({
		defaultValues: {
			servingSize: servingSize.toString(),
			unit,
		},
		validators: {
			onChange: servingFormSchema,
		},
		onSubmit: ({ value }) => {
			const parsedValue = servingFormSchema.parse(value);
			onApply(parsedValue);
			onClose();
		},
	});
	const unitOptions = getUnitOptions(ingredient);
	const createUnitItems = (
		key: string,
		label: string,
		units: { key: string; value: string; displayText: string }[],
	): SelectFieldItem[] => {
		if (units.length === 0) return [];

		return [
			{ type: "group", key, label },
			...units.map(
				(unit): SelectFieldItem => ({
					type: "option",
					key: unit.key,
					value: unit.value,
					label: unit.displayText,
				}),
			),
		];
	};
	const unitItems: SelectFieldItem[] = [
		...createUnitItems("weight", "Weight", unitOptions.weight),
		...createUnitItems("volume", "Volume", unitOptions.volume),
		...createUnitItems("custom", "Custom", unitOptions.custom),
	];
	const handleUnitChange = (nextUnit: string) => {
		const previousUnit = form.getFieldValue("unit");
		const parsedServingSize = servingSizeSchema.safeParse(
			form.getFieldValue("servingSize"),
		);

		if (parsedServingSize.success && parsedServingSize.data !== undefined) {
			const conversionFactor = calculateConversionFactorFromUnitToUnit(
				ingredient,
				ingredient.defaultUnit,
				previousUnit,
				nextUnit,
				[],
			);

			if (conversionFactor !== undefined) {
				form.setFieldValue(
					"servingSize",
					formatDraftServingSize(parsedServingSize.data * conversionFactor),
				);
			}
		}

		form.setFieldValue("unit", nextUnit);
	};

	return (
		<Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Serving</DialogTitle>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<DialogContent>
					<Stack spacing={2} sx={{ pt: 0.5 }}>
						<form.Field name="unit">
							{(field) => (
								<SelectField
									label="Unit"
									value={field.state.value}
									handleChange={handleUnitChange}
									items={unitItems}
								/>
							)}
						</form.Field>

						<form.Field name="servingSize">
							{(field) => {
								const errorMessage = field.state.meta.errors[0]?.message;

								return (
									<TextField
										label="Amount"
										inputMode="decimal"
										value={field.state.value}
										handleChange={field.handleChange}
										errorMessage={errorMessage}
									/>
								);
							}}
						</form.Field>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Box sx={{ mr: "auto" }}>
						<ResetButton
							onClick={() => {
								onApply({ servingSize: undefined, unit: undefined });
								onClose();
							}}
						/>
					</Box>
					<CancelButton onClick={onClose} />
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => <SubmitButton disabled={!canSubmit} />}
					</form.Subscribe>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export { ServingDialog };
