import Stack from "@mui/material/Stack";
import { DetailRow } from "@/pages/ingredient-list/ui/DetailRow.tsx";

type DetailGridProps = {
	detailArray: {
		label: string;
		value: string;
	}[];
};

const DetailGrid = ({ detailArray }: DetailGridProps) => {
	return (
		<Stack
			component="dl"
			sx={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: "4px 8px",
				m: 0,
			}}
		>
			{detailArray.map(({ label, value }) => (
				<DetailRow key={label} label={label} value={value} />
			))}
		</Stack>
	);
};

export { DetailGrid };
