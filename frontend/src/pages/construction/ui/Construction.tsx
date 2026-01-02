import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Chip, Grid } from "@mui/material";

function Construction() {
	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			minHeight="80vh"
		>
			<Chip label="Under construction" />
		</Grid>
	);
}

export default Construction;
