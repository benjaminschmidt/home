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
import { useState } from "react";
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

const parseServingSize = (draftServingSize: string) => {
	const trimmedServingSize = draftServingSize.trim();
	if (trimmedServingSize === "") return undefined;

	const servingSize = Number(trimmedServingSize);
	return Number.isFinite(servingSize) ? servingSize : undefined;
};

const formatDraftServingSize = (servingSize: number) =>
	`${Number(servingSize.toPrecision(12))}`;

const ServingDialog = ({
	ingredient,
	servingSize,
	unit,
	onClose,
	onApply,
}: ServingDialogProps) => {
	const [draftServingSize, setDraftServingSize] = useState(
		servingSize.toString(),
	);
	const [selectedUnit, setSelectedUnit] = useState(unit);
	const unitOptions = getUnitOptions(ingredient);
	const parsedServingSize = parseServingSize(draftServingSize);
	const amountEmpty = draftServingSize.trim() === "";
	const amountInvalid =
		!amountEmpty && (parsedServingSize === undefined || parsedServingSize <= 0);
	const handleUnitChange = (nextUnit: string) => {
		if (parsedServingSize !== undefined && parsedServingSize > 0) {
			const conversionFactor = calculateConversionFactorFromUnitToUnit(
				ingredient,
				ingredient.defaultUnit,
				selectedUnit,
				nextUnit,
				[],
			);

			if (conversionFactor !== undefined) {
				setDraftServingSize(
					formatDraftServingSize(parsedServingSize * conversionFactor),
				);
			}
		}

		setSelectedUnit(nextUnit);
	};

	return (
		<Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Serving</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ pt: 0.5 }}>
					<FormControl fullWidth>
						<InputLabel id="serving-unit-label">Unit</InputLabel>
						<Select
							labelId="serving-unit-label"
							label="Unit"
							value={selectedUnit}
							onChange={(event) => handleUnitChange(event.target.value)}
						>
							{unitOptions.weight.length > 0 && (
								<ListSubheader sx={unitGroupHeaderSx}>Weight</ListSubheader>
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
								<ListSubheader sx={unitGroupHeaderSx}>Volume</ListSubheader>
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
								<ListSubheader sx={unitGroupHeaderSx}>Custom</ListSubheader>
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

					<TextField
						label="Amount"
						type="text"
						slotProps={{ htmlInput: { inputMode: "decimal" } }}
						value={draftServingSize}
						onChange={(event) => setDraftServingSize(event.target.value)}
						error={amountInvalid}
						helperText={
							amountInvalid ? "Amount must be a number greater than 0" : " "
						}
						fullWidth
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						onApply({ servingSize: undefined, unit: undefined });
						onClose();
					}}
					sx={{ mr: "auto" }}
				>
					Reset
				</Button>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					disabled={amountInvalid}
					onClick={() => {
						onApply({
							servingSize: parsedServingSize,
							unit: selectedUnit,
						});
						onClose();
					}}
				>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export { ServingDialog };
