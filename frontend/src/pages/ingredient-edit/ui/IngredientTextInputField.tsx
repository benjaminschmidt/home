import TextField from "@mui/material/TextField";
import { IngredientFormField } from "@/pages/ingredient-edit/ui/IngredientFormField.tsx";

type IngredientTextInputFieldProps = {
	errorMessage?: string;
	handleChange: (value: string) => void;
	label: string;
	value: string;
};

const IngredientTextInputField = ({
	errorMessage,
	handleChange,
	label,
	value,
}: IngredientTextInputFieldProps) => {
	return (
		<IngredientFormField label={label}>
			<TextField
				variant="standard"
				slotProps={{
					input: { disableUnderline: true },
					htmlInput: { "aria-label": label },
				}}
				value={value}
				onChange={(event) => handleChange(event.target.value)}
				error={errorMessage !== undefined}
				helperText={errorMessage}
				fullWidth
				sx={{
					"& .MuiInputBase-input": {
						p: 0,
						typography: "body1",
						fontWeight: "fontWeightBold",
					},
					"& .MuiFormHelperText-root": { m: 0, mt: 0.5 },
				}}
			/>
		</IngredientFormField>
	);
};

export { IngredientTextInputField };
