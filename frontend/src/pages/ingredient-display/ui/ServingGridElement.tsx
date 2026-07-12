import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
	getIngredientServingDetail,
	type Ingredient,
} from "@/entities/ingredients";
import { ServingDialog } from "@/pages/ingredient-display/ui/ServingDialog.tsx";

type ServingGridElementProps = {
	ingredient: Ingredient;
	onServingChange?: (next: { servingSize?: number; unit?: string }) => void;
};

const ServingGridElement = ({
	ingredient,
	onServingChange,
}: ServingGridElementProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const servingSize = ingredient.servingSize;
	const unit = ingredient.unit;
	const servingDetail = getIngredientServingDetail({
		servingSize,
		unit,
	});
	const canChangeServing =
		servingSize !== undefined &&
		unit !== undefined &&
		ingredient.defaultUnit !== undefined;

	return (
		<>
			<ButtonBase
				component="div"
				disabled={!canChangeServing}
				onClick={() => {
					if (canChangeServing) setDialogOpen(true);
				}}
				aria-label={
					canChangeServing ? "Change serving" : "Serving cannot be changed"
				}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					gap: 0.5,
					m: 0,
					border: "1px solid",
					borderColor: "divider",
					borderRadius: 2,
					p: { xs: 1.5, sm: 1.5 },
					transition: (theme) =>
						theme.transitions.create(["background-color", "border-color"]),
					"&:hover": {
						bgcolor: "action.hover",
						borderColor: "text.secondary",
					},
					"&.Mui-disabled": {
						color: "inherit",
					},
				}}
			>
				<Typography
					component="dt"
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1,
						typography: "body2",
						color: "text.secondary",
						whiteSpace: "nowrap",
					}}
				>
					<span>{servingDetail.label}</span>
					{canChangeServing && (
						<EditOutlinedIcon
							aria-hidden="true"
							fontSize="small"
							sx={{ color: "action.active" }}
						/>
					)}
				</Typography>
				<Typography
					component="dd"
					sx={{
						typography: "body1",
						fontWeight: "fontWeightBold",
						m: 0,
						whiteSpace: "nowrap",
					}}
				>
					{servingDetail.value}
				</Typography>
			</ButtonBase>
			{dialogOpen && canChangeServing && (
				<ServingDialog
					ingredient={ingredient}
					servingSize={servingSize}
					unit={unit}
					onClose={() => setDialogOpen(false)}
					onApply={(next) => onServingChange?.(next)}
				/>
			)}
		</>
	);
};

export { ServingGridElement };
