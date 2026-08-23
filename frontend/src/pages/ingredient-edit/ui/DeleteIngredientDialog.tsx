import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

type DeleteIngredientDialogProps = {
	ingredientName: string;
	open: boolean;
	isDeleting: boolean;
	errorMessage?: string;
	onCancel: () => void;
	onConfirm: () => void;
};

const DeleteIngredientDialog = ({
	ingredientName,
	open,
	isDeleting,
	errorMessage,
	onCancel,
	onConfirm,
}: DeleteIngredientDialogProps) => (
	<Dialog
		open={open}
		onClose={() => {
			if (!isDeleting) onCancel();
		}}
		fullWidth
		maxWidth="xs"
	>
		<DialogTitle>Delete ingredient?</DialogTitle>
		<DialogContent>
			<Stack spacing={2} sx={{ pt: 0.5 }}>
				<DialogContentText>
					Permanently delete &quot;{ingredientName}&quot;? This action cannot be
					undone.
				</DialogContentText>
				{errorMessage !== undefined && (
					<Alert severity="error" variant="outlined">
						{errorMessage}
					</Alert>
				)}
			</Stack>
		</DialogContent>
		<DialogActions>
			<Tooltip title="Cancel">
				<span>
					<IconButton
						aria-label="Cancel"
						type="button"
						onClick={onCancel}
						disabled={isDeleting}
					>
						<CloseIcon />
					</IconButton>
				</span>
			</Tooltip>
			<Tooltip title="Delete">
				<span>
					<IconButton
						aria-label="Delete"
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						<DeleteForeverIcon />
					</IconButton>
				</span>
			</Tooltip>
		</DialogActions>
	</Dialog>
);

export { DeleteIngredientDialog };
