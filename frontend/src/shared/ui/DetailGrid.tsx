import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

type DetailGridProps = {
	children: ReactNode;
};

const DetailGrid = ({ children }: DetailGridProps) => {
	return (
		<Stack
			component="dl"
			sx={{
				display: "grid",
				rowGap: { xs: 1, sm: 1.5 },
				columnGap: { xs: 1, sm: 1.5 },
				gridTemplateColumns: "1fr 1fr",
				m: 0,
			}}
		>
			{children}
		</Stack>
	);
};

export { DetailGrid };
