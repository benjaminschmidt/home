import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {
	createIngredientFormDefaultValues,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";

const noop = (): void => undefined;

const IngredientFormActions = withForm({
	defaultValues: createIngredientFormDefaultValues(),
	validators: {
		onChange: ingredientFormSchema,
	},
	props: {
		onCancel: noop,
		onReset: noop,
		isSubmitting: false,
		errorMessage: undefined as string | undefined,
	},
	render: ({ form, onCancel, onReset, isSubmitting, errorMessage }) => (
		<Card
			component="section"
			aria-label="Form actions"
			variant="outlined"
			sx={{
				position: "sticky",
				top: { xs: 56, sm: 64 },
				zIndex: 1,
				bgcolor: "grey.900",
				boxShadow: 6,
				overflow: "hidden",
				width: "100%",
			}}
		>
			<CardContent
				sx={{
					p: { xs: 1, sm: 1.5 },
					"&:last-child": { pb: { xs: 1, sm: 1.5 } },
				}}
			>
				<Stack spacing={1}>
					{errorMessage !== undefined && (
						<Alert severity="error" variant="outlined">
							{errorMessage}
						</Alert>
					)}

					<Stack
						direction="row"
						sx={{
							alignItems: "center",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<form.Subscribe selector={(state) => state.isDirty}>
							{(isDirty) => (
								<Tooltip title="Reset form">
									<span>
										<IconButton
											aria-label="Reset form"
											type="button"
											onClick={() => {
												form.reset();
												onReset();
											}}
											disabled={!isDirty || isSubmitting}
											sx={{ color: "text.secondary" }}
										>
											<RestartAltIcon />
										</IconButton>
									</span>
								</Tooltip>
							)}
						</form.Subscribe>

						<Stack direction="row" spacing={0.5}>
							<form.Subscribe
								selector={(state) => state.isDirty && state.canSubmit}
							>
								{(canSave) => (
									<Tooltip title="Save changes">
										<span>
											<IconButton
												aria-label="Save changes"
												type="submit"
												disabled={!canSave || isSubmitting}
												sx={{ color: "text.secondary" }}
											>
												<SaveOutlinedIcon />
											</IconButton>
										</span>
									</Tooltip>
								)}
							</form.Subscribe>
							<Tooltip title="Cancel editing">
								<span>
									<IconButton
										aria-label="Cancel editing"
										type="button"
										onClick={onCancel}
										disabled={isSubmitting}
										sx={{ color: "text.secondary" }}
									>
										<CloseIcon />
									</IconButton>
								</span>
							</Tooltip>
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	),
});

export { IngredientFormActions };
