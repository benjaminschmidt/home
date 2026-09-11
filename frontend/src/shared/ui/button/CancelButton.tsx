import CloseIcon from "@mui/icons-material/Close";
import { IconActionButton } from "@/shared/ui/button/IconActionButton.tsx";

type CancelButtonProps = {
	disabled?: boolean;
	onClick: () => void;
};

const CancelButton = ({ disabled = false, onClick }: CancelButtonProps) => (
	<IconActionButton label="Cancel" disabled={disabled} onClick={onClick}>
		<CloseIcon />
	</IconActionButton>
);

export { CancelButton };
