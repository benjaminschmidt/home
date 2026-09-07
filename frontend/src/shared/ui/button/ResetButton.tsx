import RestartAltIcon from "@mui/icons-material/RestartAlt";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type ResetButtonProps = {
	disabled?: boolean;
	onClick: () => void;
};

const ResetButton = ({ disabled = false, onClick }: ResetButtonProps) => (
	<Tooltip title="Reset">
		<span>
			<IconButton
				aria-label="Reset"
				type="button"
				onClick={onClick}
				disabled={disabled}
				sx={{ color: "text.secondary" }}
			>
				<RestartAltIcon />
			</IconButton>
		</span>
	</Tooltip>
);

export { ResetButton };
