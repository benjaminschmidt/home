import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
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
	ingredientFormCompositionOptions,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";

const IngredientConversionPanel = withForm({
	...ingredientFormCompositionOptions,
	render: ({ form }) => (
		<Stack
			direction="column"
			role="group"
			aria-label="Weight ↔ volume conversion"
			sx={{
				alignItems: "stretch",
				gap: 0.5,
				m: 0,
				minWidth: 0,
				border: "1px solid",
				borderColor: "outline",
				borderRadius: 1,
				p: 1.5,
				pt: 2.5,
				position: "relative",
				"&:hover": {
					borderColor: "text.primary",
				},
				"&:focus-within": {
					borderColor: "primary.main",
					"& > .MuiTypography-root": { color: "primary.main" },
				},
			}}
		>
			<Typography
				component="div"
				sx={{
					position: "absolute",
					top: 0,
					left: 10,
					transform: "translateY(-50%)",
					px: 0.5,
					bgcolor: "background.paper",
					typography: "body2",
					fontSize: "0.75rem",
					color: "text.secondary",
					whiteSpace: "nowrap",
					lineHeight: "1.4375em",
				}}
			>
				Weight ↔ volume conversion
			</Typography>
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
									label="Amount"
									size="small"
									variant="outlined"
									type="text"
									slotProps={{
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
										flex: 2,
										"& .MuiInputBase-input": {
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
								<InputLabel id="weight-unit-label" aria-label="Weight unit">
									Unit
								</InputLabel>
								<Select
									labelId="weight-unit-label"
									label="Unit"
									size="small"
									inputProps={{ "aria-label": "Weight unit" }}
									value={field.state.value}
									onChange={(event) => field.handleChange(event.target.value)}
									sx={{
										"& .MuiSelect-select": {
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
									label="Amount"
									size="small"
									variant="outlined"
									type="text"
									slotProps={{
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
										flex: 2,
										"& .MuiInputBase-input": {
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
								<InputLabel id="volume-unit-label" aria-label="Volume unit">
									Unit
								</InputLabel>
								<Select
									labelId="volume-unit-label"
									label="Unit"
									size="small"
									inputProps={{ "aria-label": "Volume unit" }}
									value={field.state.value}
									onChange={(event) => field.handleChange(event.target.value)}
									sx={{
										"& .MuiSelect-select": {
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
		</Stack>
	),
});

export { IngredientConversionPanel };
