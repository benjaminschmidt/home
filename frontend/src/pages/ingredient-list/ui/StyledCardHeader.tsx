import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

type StyledCardHeaderProps = {
	title: string;
};

const StyledCardHeader = ({ title }: StyledCardHeaderProps) => {
	return (
		<CardHeader
			title={
				<Typography
					variant="body1"
					sx={{
						fontWeight: 700,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
					title={title}
				>
					{title}
				</Typography>
			}
			sx={{
				pb: 1.5,
				pt: 1.5,
				px: 2,
				borderBottom: "1px solid",
				borderColor: "divider",
				bgcolor: "action.hover",
			}}
		/>
	);
};

export { StyledCardHeader };
