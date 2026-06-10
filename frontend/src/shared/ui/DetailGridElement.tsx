import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type DetailGridElementProps = {
	label: string;
	value: string;
};

const DetailGridElement = ({ label, value }: DetailGridElementProps) => {
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
				p: { xs: 1.5, sm: 1.5 },
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
			<Typography
				component="dd"
				sx={{
					typography: "body1",
					fontWeight: "fontWeightBold",
					m: 0,
					whiteSpace: "nowrap",
				}}
			>
				{value}
			</Typography>
		</Stack>
	);
};

export { DetailGridElement };
