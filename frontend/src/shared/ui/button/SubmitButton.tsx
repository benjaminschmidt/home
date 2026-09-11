import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { IconActionButton } from "@/shared/ui/button/IconActionButton.tsx";

type SubmitButtonProps = {
	disabled?: boolean;
};

const SubmitButton = ({ disabled = false }: SubmitButtonProps) => (
	<IconActionButton label="Save" type="submit" disabled={disabled}>
		<SaveOutlinedIcon />
	</IconActionButton>
);

export { SubmitButton };
