import { Chip, Grid } from "@mui/material";
import { Layout } from "@/widgets/layout";

const Construction = () => {
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
};

export { Construction };
