import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type DeleteButtonProps = {
	disabled?: boolean;
	onClick: () => void;
};

const DeleteButton = ({ disabled = false, onClick }: DeleteButtonProps) => (
	<Tooltip title="Delete">
		<span>
			<IconButton
				aria-label="Delete"
				type="button"
				onClick={onClick}
				disabled={disabled}
				sx={{ color: "text.secondary" }}
			>
				<DeleteForeverIcon />
			</IconButton>
		</span>
	</Tooltip>
);

export { DeleteButton };
