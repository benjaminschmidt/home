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
import type { CustomUnitDto } from "home-api/dist/src";
import { useState } from "react";
import {
	formatUnit,
	volumeUnitDtoArray,
	weightUnitDtoArray,
} from "@/entities/ingredients";

type ServingDialogProps = {
	servingSize?: number;
	unit?: string;
	customUnits?: CustomUnitDto[];
	onClose: () => void;
	onApply: (next: { servingSize?: number; unit?: string }) => void;
};

const emptyCustomUnits: CustomUnitDto[] = [];

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
	return Number.isNaN(servingSize) ? undefined : servingSize;
};

const ServingDialog = ({
	servingSize,
	unit,
	customUnits = emptyCustomUnits,
	onClose,
	onApply,
}: ServingDialogProps) => {
	const [draftServingSize, setDraftServingSize] = useState(
		servingSize?.toString() ?? "",
	);
	const [selectedUnit, setSelectedUnit] = useState(unit ?? "GRAM");

	return (
		<Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle>Serving</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ pt: 0.5 }}>
					<TextField
						label="Amount"
						type="number"
						value={draftServingSize}
						onChange={(event) => setDraftServingSize(event.target.value)}
						fullWidth
					/>

					<FormControl fullWidth>
						<InputLabel id="serving-unit-label">Unit</InputLabel>
						<Select
							labelId="serving-unit-label"
							label="Unit"
							value={selectedUnit}
							onChange={(event) => setSelectedUnit(event.target.value)}
						>
							<ListSubheader sx={unitGroupHeaderSx}>Weight</ListSubheader>
							{weightUnitDtoArray.map((weightUnit) => (
								<MenuItem
									key={weightUnit}
									value={weightUnit}
									sx={unitMenuItemSx}
								>
									{formatUnit(weightUnit)}
								</MenuItem>
							))}
							<ListSubheader sx={unitGroupHeaderSx}>Volume</ListSubheader>
							{volumeUnitDtoArray.map((volumeUnit) => (
								<MenuItem
									key={volumeUnit}
									value={volumeUnit}
									sx={unitMenuItemSx}
								>
									{formatUnit(volumeUnit)}
								</MenuItem>
							))}
							{customUnits.length > 0 && (
								<ListSubheader sx={unitGroupHeaderSx}>Custom</ListSubheader>
							)}
							{customUnits.map((customUnit) => (
								<MenuItem
									key={customUnit.name}
									value={customUnit.name}
									sx={unitMenuItemSx}
								>
									{customUnit.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={() => {
						onApply({
							servingSize: parseServingSize(draftServingSize),
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
