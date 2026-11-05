import AddIcon from "@mui/icons-material/Add";
import { IconActionButton } from "@/shared/ui/button/IconActionButton.tsx";

type AddButtonProps = {
	disabled?: boolean;
	label?: string;
	onClick: () => void;
};

const AddButton = ({
	disabled = false,
	label = "Add",
	onClick,
}: AddButtonProps) => (
	<IconActionButton label={label} disabled={disabled} onClick={onClick}>
		<AddIcon />
	</IconActionButton>
);

export { AddButton };
