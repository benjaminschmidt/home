import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { CancelButton, DeleteButton } from "@/shared/ui/button";

type DeleteIngredientVariantDialogProps = {
	variantDescription: string;
	open: boolean;
	isDeleting: boolean;
	errorMessage?: string;
	onCancel: () => void;
	onConfirm: () => void;
};

const DeleteIngredientVariantDialog = ({
	variantDescription,
	open,
	isDeleting,
	errorMessage,
	onCancel,
	onConfirm,
}: DeleteIngredientVariantDialogProps) => (
	<Dialog
		open={open}
		onClose={() => {
			if (!isDeleting) onCancel();
		}}
		fullWidth
		maxWidth="xs"
	>
		<DialogTitle>Delete ingredient variant?</DialogTitle>
		<DialogContent>
			<Stack spacing={2} sx={{ pt: 0.5 }}>
				<DialogContentText>
					Permanently delete variant &quot;{variantDescription}&quot;? This
					action cannot be undone.
				</DialogContentText>
				{errorMessage !== undefined && (
					<Alert severity="error" variant="outlined">
						{errorMessage}
					</Alert>
				)}
			</Stack>
		</DialogContent>
		<DialogActions>
			<CancelButton onClick={onCancel} disabled={isDeleting} />
			<DeleteButton onClick={onConfirm} disabled={isDeleting} />
		</DialogActions>
	</Dialog>
);

export { DeleteIngredientVariantDialog };
