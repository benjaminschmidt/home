import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import type { CustomUnitDto } from "home-api/dist/src";
import { useState } from "react";
import { getIngredientServingDetail } from "@/entities/ingredients";
import { ServingDialog } from "@/pages/ingredient-display/ui/ServingDialog.tsx";

type ServingGridElementProps = {
	servingSize?: number;
	unit?: string;
	customUnits?: CustomUnitDto[];
	onServingChange?: (next: { servingSize?: number; unit?: string }) => void;
};

const ServingGridElement = ({
	servingSize,
	unit,
	customUnits,
	onServingChange,
}: ServingGridElementProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const servingDetail = getIngredientServingDetail({ servingSize, unit });

	return (
		<>
			<ButtonBase
				component="div"
				onClick={() => setDialogOpen(true)}
				aria-label="Change serving"
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
				}}
			>
				<Typography
					component="dt"
					sx={{
						typography: "body2",
						color: "text.secondary",
						whiteSpace: "nowrap",
					}}
				>
					{servingDetail.label}
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
			{dialogOpen && (
				<ServingDialog
					servingSize={servingSize}
					unit={unit}
					customUnits={customUnits}
					onClose={() => setDialogOpen(false)}
					onApply={(next) => onServingChange?.(next)}
				/>
			)}
		</>
	);
};

export { ServingGridElement };
