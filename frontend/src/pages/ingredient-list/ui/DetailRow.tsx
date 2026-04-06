import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type DetailRowProps = { label: string; value: string };

const DetailRow = ({ label, value }: DetailRowProps) => (
	<Stack direction="row" sx={{ gap: 0.5, alignItems: "baseline", m: 0 }}>
		<Typography
			component="dt"
			variant="caption"
			sx={{ color: "text.secondary", whiteSpace: "nowrap" }}
		>
			{label}:
		</Typography>
		<Typography
			component="dd"
			variant="caption"
			sx={{ fontWeight: 600, m: 0, whiteSpace: "nowrap" }}
		>
			{value}
		</Typography>
	</Stack>
);

export { DetailRow };
