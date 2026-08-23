import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

type DescriptionListProps = {
	children: ReactNode;
};

const DescriptionList = ({ children }: DescriptionListProps) => {
	return (
		<Stack
			component="dl"
			sx={{
				display: "grid",
				rowGap: { xs: 1.5, sm: 2 },
				columnGap: { xs: 1.5, sm: 2 },
				gridTemplateColumns: "1fr 1fr",
			}}
		>
			{children}
		</Stack>
	);
};

export { DescriptionList };
