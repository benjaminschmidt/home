import { Chip, Grid } from "@mui/material";
import { Layout } from "@/widgets/layout";

const IngredientList = () => {
	return (
		<Layout>
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<Chip label="Ingredient List (Under construction)" />
			</Grid>
		</Layout>
	);
};

export { IngredientList };
