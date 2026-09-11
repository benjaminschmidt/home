import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IconActionButton } from "@/shared/ui/button/IconActionButton.tsx";

type DeleteButtonProps = {
	disabled?: boolean;
	onClick: () => void;
};

const DeleteButton = ({ disabled = false, onClick }: DeleteButtonProps) => (
	<IconActionButton label="Delete" disabled={disabled} onClick={onClick}>
		<DeleteForeverIcon />
	</IconActionButton>
);

export { DeleteButton };
