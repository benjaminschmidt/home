import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type IngredientFormFieldProps = {
	label: string;
	children: ReactNode;
};

const IngredientFormField = ({ label, children }: IngredientFormFieldProps) => {
	return (
		<Stack
			direction="column"
			sx={{
				alignItems: "stretch",
				gap: 0.5,
				m: 0,
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				p: 1.5,
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
				{label}
			</Typography>
			{children}
		</Stack>
	);
};

export { IngredientFormField };
