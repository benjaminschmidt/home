import { Chip, Grid } from "@mui/material";

const Construction = () => {
	return (
		<Grid
			container
			sx={{ justifyContent: "center", alignItems: "center", minHeight: "80vh" }}
		>
			<Chip label="Under construction" />
		</Grid>
	);
};

export { Construction };
