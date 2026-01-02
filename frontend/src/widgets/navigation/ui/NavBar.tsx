import ArrowBack from "@mui/icons-material/ArrowBack";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { type ParsedLocation, useLocation } from "@tanstack/react-router";
import { RouterLink } from "@/shared/ui/RouterLink.tsx";

const getCurrent = (location: ParsedLocation) => {
	if (location.pathname === "/") return "recipes";
	else if (location.pathname.startsWith("/recipes")) return "recipes";
	else if (location.pathname.startsWith("/ingredients")) return "ingredients";
};

const NavBar = () => {
	const location = useLocation();
	const value = getCurrent(location);

	return (
		<AppBar position="sticky">
			<BottomNavigation value={value}>
				<BottomNavigationAction
					aria-label="Navigate up"
					aria-selected={false}
					component={RouterLink}
					icon={<ArrowBack />}
					showLabel={false}
					href=".."
				/>
				<BottomNavigationAction
					label="Recipes"
					value="recipes"
					aria-selected={value === "recipes"}
					component={RouterLink}
					icon={<RestaurantMenuIcon />}
					showLabel={true}
					href="/recipes"
				/>
				<BottomNavigationAction
					label="Ingredients"
					value="ingredients"
					aria-selected={value === "ingredients"}
					component={RouterLink}
					icon={<BakeryDiningIcon />}
					showLabel={true}
					href="/ingredients"
				/>
			</BottomNavigation>
		</AppBar>
	);
};

export default NavBar;
