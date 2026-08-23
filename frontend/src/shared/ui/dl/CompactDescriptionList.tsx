import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";

type CompactDescriptionListProps = {
	children: ReactNode;
};

const CompactDescriptionList = ({ children }: CompactDescriptionListProps) => {
	return (
		<Stack
			component="dl"
			sx={{
				display: "grid",
				gap: "4px 8px",
				gridTemplateColumns: "1fr 1fr",
				m: 0,
			}}
		>
			{children}
		</Stack>
	);
};

export { CompactDescriptionList };
