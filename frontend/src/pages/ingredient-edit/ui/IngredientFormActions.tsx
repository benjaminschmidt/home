import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CancelButton, ResetButton, SaveButton } from "@/shared/ui/button";

type IngredientFormActionsProps = {
	canSaveAll: boolean;
	errorMessage?: string;
	isSubmitting?: boolean;
	onCancel: () => void;
	onDiscardAll: () => void;
	onSaveAll: () => void;
	unsavedCount: number;
};

const IngredientFormActions = ({
	canSaveAll,
	errorMessage,
	isSubmitting = false,
	onCancel,
	onDiscardAll,
	onSaveAll,
	unsavedCount,
}: IngredientFormActionsProps) => (
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
					<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
						<ResetButton
							onClick={onDiscardAll}
							disabled={unsavedCount === 0 || isSubmitting}
						/>
						{unsavedCount > 0 && (
							<Typography variant="body2" color="text.secondary">
								{unsavedCount} unsaved change
								{unsavedCount === 1 ? "" : "s"}
							</Typography>
						)}
					</Stack>

					<Stack direction="row" spacing={0.5}>
						<SaveButton
							type="button"
							label="Save all"
							onClick={onSaveAll}
							disabled={!canSaveAll || isSubmitting}
						/>
						<CancelButton onClick={onCancel} disabled={isSubmitting} />
					</Stack>
				</Stack>
			</Stack>
		</CardContent>
	</Card>
);

export type { IngredientFormActionsProps };
export { IngredientFormActions };
