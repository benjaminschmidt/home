import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
	formatUnit,
	volumeUnitDtoArray,
	weightUnitDtoArray,
} from "@/entities/ingredients";
import {
	createIngredientFormDefaultValues,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { IngredientFormField } from "@/pages/ingredient-edit/ui/IngredientFormField.tsx";

const IngredientConversionPanel = withForm({
	defaultValues: createIngredientFormDefaultValues(),
	validators: {
		onChange: ingredientFormSchema,
	},
	render: ({ form }) => (
		<Stack spacing={1}>
			<IngredientFormField label="Weight ↔ volume conversion">
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "minmax(0, 1fr)",
							sm: "minmax(0, 1fr) auto minmax(0, 1fr)",
						},
						gap: { xs: 1, sm: 1.5 },
						alignItems: "center",
					}}
				>
					<Stack
						direction="row"
						spacing={1}
						sx={{ minWidth: 0, alignItems: "center" }}
					>
						<form.AppField name="weightAmount">
							{(field) => {
								const errorMessage = field.state.meta.errors[0]?.message;

								return (
									<TextField
										variant="standard"
										type="text"
										slotProps={{
											input: { disableUnderline: true },
											htmlInput: {
												inputMode: "decimal",
												"aria-label": "Weight amount",
											},
										}}
										value={field.state.value}
										onChange={(event) => field.handleChange(event.target.value)}
										error={errorMessage !== undefined}
										helperText={errorMessage}
										sx={{
											minWidth: 0,
											flex: 1,
											"& .MuiInputBase-input": {
												p: 0,
												typography: "body1",
												fontWeight: "fontWeightBold",
											},
											"& .MuiFormHelperText-root": { m: 0, mt: 0.5 },
										}}
									/>
								);
							}}
						</form.AppField>
						<form.AppField name="weightUnit">
							{(field) => (
								<FormControl fullWidth sx={{ minWidth: 0, flex: 1 }}>
									<Select
										variant="standard"
										disableUnderline
										inputProps={{ "aria-label": "Weight unit" }}
										value={field.state.value}
										onChange={(event) => field.handleChange(event.target.value)}
										sx={{
											"& .MuiSelect-select": {
												p: 0,
												pr: 3,
												typography: "body1",
												fontWeight: "fontWeightBold",
											},
											"& .MuiSelect-icon": { right: 0 },
										}}
									>
										{weightUnitDtoArray.map((unit) => (
											<MenuItem key={unit} value={unit}>
												{formatUnit(unit)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}
						</form.AppField>
					</Stack>

					<Typography sx={{ justifySelf: "center" }}>=</Typography>

					<Stack
						direction="row"
						spacing={1}
						sx={{ minWidth: 0, alignItems: "center" }}
					>
						<form.AppField name="volumeAmount">
							{(field) => {
								const errorMessage = field.state.meta.errors[0]?.message;

								return (
									<TextField
										variant="standard"
										type="text"
										slotProps={{
											input: { disableUnderline: true },
											htmlInput: {
												inputMode: "decimal",
												"aria-label": "Volume amount",
											},
										}}
										value={field.state.value}
										onChange={(event) => field.handleChange(event.target.value)}
										error={errorMessage !== undefined}
										helperText={errorMessage}
										sx={{
											minWidth: 0,
											flex: 1,
											"& .MuiInputBase-input": {
												p: 0,
												typography: "body1",
												fontWeight: "fontWeightBold",
											},
											"& .MuiFormHelperText-root": { m: 0, mt: 0.5 },
										}}
									/>
								);
							}}
						</form.AppField>
						<form.AppField name="volumeUnit">
							{(field) => (
								<FormControl fullWidth sx={{ minWidth: 0, flex: 1 }}>
									<Select
										variant="standard"
										disableUnderline
										inputProps={{ "aria-label": "Volume unit" }}
										value={field.state.value}
										onChange={(event) => field.handleChange(event.target.value)}
										sx={{
											"& .MuiSelect-select": {
												p: 0,
												pr: 3,
												typography: "body1",
												fontWeight: "fontWeightBold",
											},
											"& .MuiSelect-icon": { right: 0 },
										}}
									>
										{volumeUnitDtoArray.map((unit) => (
											<MenuItem key={unit} value={unit}>
												{formatUnit(unit)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}
						</form.AppField>
					</Stack>
				</Box>
			</IngredientFormField>
			<Typography variant="caption" color="text.secondary">
				Lets recipes convert between weight and volume for this ingredient
				(optional).
			</Typography>
		</Stack>
	),
});

export { IngredientConversionPanel };
