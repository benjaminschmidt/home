import Stack from "@mui/material/Stack";
import { OverviewGridElement } from "@/shared/ui/OverviewGridElement.tsx";

type OverviewGridProps = {
	detailArray: {
		label: string;
		value: string;
	}[];
};

const OverviewGrid = ({ detailArray }: OverviewGridProps) => {
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
			{detailArray.map(({ label, value }) => (
				<OverviewGridElement key={label} label={label} value={value} />
			))}
		</Stack>
	);
};

export { OverviewGrid };
