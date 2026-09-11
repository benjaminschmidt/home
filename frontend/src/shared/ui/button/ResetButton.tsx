import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconActionButton } from "@/shared/ui/button/IconActionButton.tsx";

type ResetButtonProps = {
	disabled?: boolean;
	onClick: () => void;
};

const ResetButton = ({ disabled = false, onClick }: ResetButtonProps) => (
	<IconActionButton label="Reset" disabled={disabled} onClick={onClick}>
		<RestartAltIcon />
	</IconActionButton>
);

export { ResetButton };
