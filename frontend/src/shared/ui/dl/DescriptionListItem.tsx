import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type DescriptionListItemProps = {
	label: string;
	value: string;
};

const DescriptionListItem = ({ label, value }: DescriptionListItemProps) => {
	return (
		<Stack
			direction="column"
			sx={{
				alignItems: "stretch",
				gap: 0.5,
				m: 0,
				minWidth: 0,
				border: "1px solid",
				borderColor: "outline",
				borderRadius: 1,
				p: 1.5,
				pt: 2.5,
				position: "relative",
			}}
		>
			<Typography
				component="dt"
				sx={{
					position: "absolute",
					top: 0,
					left: 10,
					transform: "translateY(-50%)",
					px: 0.5,
					bgcolor: "background.paper",
					typography: "body2",
					fontSize: "0.75rem",
					color: "text.secondary",
					minWidth: 0,
					whiteSpace: { xs: "normal", sm: "nowrap" },
					overflowWrap: "anywhere",
					lineHeight: "1.4375em",
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
					minWidth: 0,
					whiteSpace: { xs: "normal", sm: "nowrap" },
					overflowWrap: "anywhere",
				}}
			>
				{value}
			</Typography>
		</Stack>
	);
};

export { DescriptionListItem };
