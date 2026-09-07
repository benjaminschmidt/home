import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

type SubmitButtonProps = {
	disabled?: boolean;
};

const SubmitButton = ({ disabled = false }: SubmitButtonProps) => (
	<Tooltip title="Save">
		<span>
			<IconButton
				aria-label="Save"
				type="submit"
				disabled={disabled}
				sx={{ color: "text.secondary" }}
			>
				<SaveOutlinedIcon />
			</IconButton>
		</span>
	</Tooltip>
);

export { SubmitButton };
