import CardActions from "@mui/material/CardActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

type StyledCardActionSelectorProps = {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
	options: {
		default: boolean;
		id?: string;
		value: string;
	}[];
};

const StyledCardActionSelector = ({
	selectedIndex,
	setSelectedIndex,
	options,
}: StyledCardActionSelectorProps) => {
	if (options.length === 0) {
		return null;
	}

	return (
		<CardActions sx={{ px: 1.5, py: 0.5 }}>
			<Select
				value={selectedIndex}
				onChange={(e) => setSelectedIndex(Number(e.target.value))}
				variant="standard"
				disableUnderline
				fullWidth
				sx={{
					fontSize: "0.7rem",
					color: "text.disabled",
					"& .MuiSelect-select": {
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						py: 0,
						textAlign: "center",
					},
					"& .MuiSelect-icon": {
						color: "text.disabled",
						fontSize: "1rem",
					},
				}}
			>
				{options.map((option, i) => (
					<MenuItem
						key={option.id ?? i}
						value={i}
						sx={{
							textAlign: "center",
							justifyContent: "center",
							whiteSpace: "normal",
							wordBreak: "break-word",
						}}
					>
						{option.default ? "★ " : ""}
						{option.value}
					</MenuItem>
				))}
			</Select>
		</CardActions>
	);
};

export { StyledCardActionSelector };
