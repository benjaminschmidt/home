import CardActions from "@mui/material/CardActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

type StyledCardActionSelectorProps = {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
	forceCompact?: boolean;
	options: {
		default: boolean;
		id?: string;
		value: string;
	}[];
};

const StyledCardActionSelector = ({
	selectedIndex,
	setSelectedIndex,
	forceCompact = false,
	options,
}: StyledCardActionSelectorProps) => {
	if (options.length === 0) {
		return null;
	}

	return (
		<CardActions
			sx={{
				px: forceCompact ? 1.5 : { xs: 1.5, sm: 2.5 },
				py: forceCompact ? 0.5 : { xs: 0.5, sm: 1 },
			}}
		>
			<Select
				value={selectedIndex}
				onChange={(e) => setSelectedIndex(Number(e.target.value))}
				variant="standard"
				disableUnderline
				fullWidth
				sx={{
					fontSize: forceCompact ? "0.7rem" : { xs: "0.7rem", sm: "1.05rem" },
					"& .MuiSelect-select": {
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						py: forceCompact ? 0 : { xs: 0, sm: 0.5 },
						textAlign: "center",
					},
					"& .MuiSelect-icon": {
						fontSize: forceCompact ? "1rem" : { xs: "1rem", sm: "1.25rem" },
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
