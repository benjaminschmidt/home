import { Chip, Grid } from "@mui/material";
import Layout from "@/widgets/layout/ui/Layout.tsx";

function Construction() {
	return (
		<Layout>
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<Chip label="Under construction" />
			</Grid>
		</Layout>
	);
}

export default Construction;
