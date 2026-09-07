import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type CompactDescriptionListItemProps = {
	label: string;
	value: string;
};

const CompactDescriptionListItem = ({
	label,
	value,
}: CompactDescriptionListItemProps) => {
	return (
		<Stack
			direction={"row"}
			sx={{
				alignItems: "baseline",
				gap: 0.5,
				m: 0,
				minWidth: 0,
			}}
		>
			<Typography
				component="dt"
				variant={"caption"}
				sx={{
					color: "text.secondary",
					minWidth: 0,
					whiteSpace: { xs: "normal", sm: "nowrap" },
					overflowWrap: "anywhere",
				}}
			>
				{label}
			</Typography>
			<Typography
				component="dd"
				variant={"caption"}
				sx={{
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

export { CompactDescriptionListItem };
