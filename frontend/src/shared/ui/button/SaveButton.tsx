import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { IconActionButton } from "@/shared/ui/button/IconActionButton.tsx";

type SaveButtonProps = {
	disabled?: boolean;
	label?: string;
	onClick?: () => void;
	type?: "button" | "submit";
};

const SaveButton = ({
	disabled = false,
	label = "Save",
	onClick,
	type = "submit",
}: SaveButtonProps) => (
	<IconActionButton
		label={label}
		type={type}
		onClick={onClick}
		disabled={disabled}
	>
		<SaveOutlinedIcon />
	</IconActionButton>
);

export { SaveButton };
