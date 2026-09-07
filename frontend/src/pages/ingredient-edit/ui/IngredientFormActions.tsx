import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import {
	createIngredientFormDefaultValues,
	withForm,
} from "@/pages/ingredient-edit/model/ingredientForm.ts";
import { ingredientFormSchema } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import {
	CancelButton,
	DeleteButton,
	ResetButton,
	SubmitButton,
} from "@/shared/ui/button";

const noop = (): void => undefined;

const IngredientFormActions = withForm({
	defaultValues: createIngredientFormDefaultValues(),
	validators: {
		onChange: ingredientFormSchema,
	},
	props: {
		onCancel: noop,
		onDelete: undefined as (() => void) | undefined,
		onReset: noop,
		isSubmitting: false,
		errorMessage: undefined as string | undefined,
	},
	render: ({
		form,
		onCancel,
		onDelete,
		onReset,
		isSubmitting,
		errorMessage,
	}) => (
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
						<Stack direction="row" spacing={0.5}>
							<form.Subscribe selector={(state) => state.isDirty}>
								{(isDirty) => (
									<ResetButton
										onClick={() => {
											form.reset();
											onReset();
										}}
										disabled={!isDirty || isSubmitting}
									/>
								)}
							</form.Subscribe>
							{onDelete !== undefined && (
								<DeleteButton onClick={onDelete} disabled={isSubmitting} />
							)}
						</Stack>

						<Stack direction="row" spacing={0.5}>
							<form.Subscribe
								selector={(state) => state.isDirty && state.canSubmit}
							>
								{(canSave) => (
									<SubmitButton disabled={!canSave || isSubmitting} />
								)}
							</form.Subscribe>
							<CancelButton onClick={onCancel} disabled={isSubmitting} />
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	),
});

export { IngredientFormActions };
