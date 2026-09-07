import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type CancelButtonProps = {
	disabled?: boolean;
	onClick: () => void;
};

const CancelButton = ({ disabled = false, onClick }: CancelButtonProps) => (
	<Tooltip title="Cancel">
		<span>
			<IconButton
				aria-label="Cancel"
				type="button"
				onClick={onClick}
				disabled={disabled}
				sx={{ color: "text.secondary" }}
			>
				<CloseIcon />
			</IconButton>
		</span>
	</Tooltip>
);

export { CancelButton };
