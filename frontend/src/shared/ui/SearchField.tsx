import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";

type SearchFieldProps = {
	search: string;
	onSearchChange: (search: string) => void;
};

const SEARCH_DEBOUNCE_MS = 300;

const SearchField = ({ search, onSearchChange }: SearchFieldProps) => {
	const [draftSearch, setDraftSearch] = useState(search);
	const timeoutRef = useRef<number | undefined>(undefined);

	return (
		<TextField
			fullWidth
			placeholder="Search"
			size="small"
			value={draftSearch}
			onChange={(event) => {
				const nextSearch = event.target.value;
				setDraftSearch(nextSearch);

				window.clearTimeout(timeoutRef.current);
				timeoutRef.current = window.setTimeout(() => {
					onSearchChange(nextSearch.trim());
				}, SEARCH_DEBOUNCE_MS);
			}}
			slotProps={{
				htmlInput: {
					"aria-label": "Search",
				},
				input: {
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon fontSize="small" />
						</InputAdornment>
					),
					endAdornment: draftSearch ? (
						<InputAdornment position="end">
							<IconButton
								aria-label="Clear search"
								edge="end"
								onClick={() => {
									setDraftSearch("");
									onSearchChange("");
								}}
								size="small"
							>
								<ClearIcon fontSize="small" />
							</IconButton>
						</InputAdornment>
					) : undefined,
				},
			}}
		/>
	);
};

export { SearchField };
