import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useId } from "react";

type SelectFieldItem =
	| {
			type: "option";
			key: string;
			value: string;
			label: string;
	  }
	| {
			type: "group";
			key: string;
			label: string;
	  };

type SelectFieldProps = {
	handleChange: (value: string) => void;
	items: SelectFieldItem[];
	label: string;
	value: string;
};

const SelectField = ({
	handleChange,
	items,
	label,
	value,
}: SelectFieldProps) => {
	const labelId = useId();
	let isGrouped = false;
	const selectItems = items.map((item) => {
		if (item.type === "group") {
			isGrouped = true;

			return (
				<ListSubheader
					key={item.key}
					sx={{
						typography: "caption",
						fontWeight: "fontWeightBold",
						color: "text.secondary",
						bgcolor: "background.paper",
						textTransform: "uppercase",
						letterSpacing: 0,
						lineHeight: 2,
					}}
				>
					{item.label}
				</ListSubheader>
			);
		}

		return (
			<MenuItem
				key={item.key}
				value={item.value}
				sx={isGrouped ? { pl: 3 } : undefined}
			>
				{item.label}
			</MenuItem>
		);
	});

	return (
		<FormControl fullWidth>
			<InputLabel id={labelId}>{label}</InputLabel>
			<Select
				labelId={labelId}
				label={label}
				value={value}
				onChange={(event) => handleChange(event.target.value)}
			>
				{selectItems}
			</Select>
		</FormControl>
	);
};

export type { SelectFieldItem };
export { SelectField };
