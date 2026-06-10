import Stack from "@mui/material/Stack";
import { DetailGridElement } from "@/shared/ui/DetailGridElement.tsx";

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
				rowGap: { xs: 1, sm: 1.5 },
				columnGap: { xs: 1, sm: 1.5 },
				gridTemplateColumns: "1fr 1fr",
				m: 0,
			}}
		>
			{detailArray.map(({ label, value }) => (
				<DetailGridElement key={label} label={label} value={value} />
			))}
		</Stack>
	);
};

export { DetailGrid };
