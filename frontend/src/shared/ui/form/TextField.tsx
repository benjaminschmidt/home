import MuiTextField from "@mui/material/TextField";
import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
	errorMessage?: string;
	handleChange: (value: string) => void;
	inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
	label: string;
	value: string;
};

const TextField = ({
	errorMessage,
	handleChange,
	inputMode,
	label,
	value,
}: TextFieldProps) => (
	<MuiTextField
		label={label}
		type="text"
		slotProps={{ htmlInput: { inputMode } }}
		value={value}
		onChange={(event) => handleChange(event.target.value)}
		error={errorMessage !== undefined}
		helperText={errorMessage}
		fullWidth
	/>
);

export { TextField };
