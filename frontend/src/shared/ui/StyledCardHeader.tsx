import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

type StyledCardHeaderProps = {
	title: string;
	forceCompact?: boolean;
};

const StyledCardHeader = ({
	title,
	forceCompact = false,
}: StyledCardHeaderProps) => {
	return (
		<CardHeader
			title={
				<Typography
					variant={forceCompact ? "body1" : "h5"}
					sx={{
						typography: forceCompact ? "body1" : { xs: "body1", sm: "h5" },
						fontWeight: { xs: "fontWeightBold", sm: "fontWeightBold" },
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: forceCompact ? "nowrap" : "normal",
					}}
					title={title}
				>
					{title}
				</Typography>
			}
			sx={{
				bgcolor: "action.hover",
				borderBottom: "1px solid",
				borderColor: "divider",
				py: forceCompact ? 1.5 : { xs: 1.5, sm: 2.5 },
				px: forceCompact ? 2 : { xs: 2, sm: 3 },
			}}
		/>
	);
};

export { StyledCardHeader };
