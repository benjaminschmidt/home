import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
	calculateConversionFactorFromUnitToUnit,
	getUnitOptions,
	type Ingredient,
} from "@/entities/ingredients";

type ServingDialogProps = {
	ingredient: Ingredient;
	servingSize: number;
	unit: string;
	onClose: () => void;
	onApply: (next: { servingSize?: number; unit?: string }) => void;
};

const unitGroupHeaderSx = {
	typography: "caption",
	fontWeight: "fontWeightBold",
	color: "text.secondary",
	bgcolor: "background.paper",
	textTransform: "uppercase",
	letterSpacing: 0,
	lineHeight: 2,
};

const unitMenuItemSx = {
	pl: 3,
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
								<FormControl fullWidth>
									<InputLabel id="serving-unit-label">Unit</InputLabel>
									<Select
										labelId="serving-unit-label"
										label="Unit"
										value={field.state.value}
										onChange={(event) => handleUnitChange(event.target.value)}
									>
										{unitOptions.weight.length > 0 && (
											<ListSubheader sx={unitGroupHeaderSx}>
												Weight
											</ListSubheader>
										)}
										{unitOptions.weight.map((weightUnit) => (
											<MenuItem
												key={weightUnit.key}
												value={weightUnit.value}
												sx={unitMenuItemSx}
											>
												{weightUnit.displayText}
											</MenuItem>
										))}
										{unitOptions.volume.length > 0 && (
											<ListSubheader sx={unitGroupHeaderSx}>
												Volume
											</ListSubheader>
										)}
										{unitOptions.volume.map((volumeUnit) => (
											<MenuItem
												key={volumeUnit.key}
												value={volumeUnit.value}
												sx={unitMenuItemSx}
											>
												{volumeUnit.displayText}
											</MenuItem>
										))}
										{unitOptions.custom.length > 0 && (
											<ListSubheader sx={unitGroupHeaderSx}>
												Custom
											</ListSubheader>
										)}
										{unitOptions.custom.map((customUnit) => (
											<MenuItem
												key={customUnit.key}
												value={customUnit.value}
												sx={unitMenuItemSx}
											>
												{customUnit.displayText}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}
						</form.Field>

						<form.Field name="servingSize">
							{(field) => {
								const errorMessage = field.state.meta.errors[0]?.message;

								return (
									<TextField
										label="Amount"
										type="text"
										slotProps={{ htmlInput: { inputMode: "decimal" } }}
										value={field.state.value}
										onChange={(event) => field.handleChange(event.target.value)}
										error={errorMessage !== undefined}
										helperText={errorMessage ?? " "}
										fullWidth
									/>
								);
							}}
						</form.Field>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						type="button"
						onClick={() => {
							onApply({ servingSize: undefined, unit: undefined });
							onClose();
						}}
						sx={{ mr: "auto" }}
					>
						Reset
					</Button>
					<Button type="button" onClick={onClose}>
						Cancel
					</Button>
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<Button type="submit" variant="contained" disabled={!canSubmit}>
								Apply
							</Button>
						)}
					</form.Subscribe>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export { ServingDialog };
