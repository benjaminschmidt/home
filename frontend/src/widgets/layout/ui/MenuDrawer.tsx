import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { drawerWidth } from "@/widgets/layout/config/drawerConfig.ts";
import { MenuDrawerContent } from "@/widgets/layout/ui/MenuDrawerContent.tsx";

type MenuDrawerProps = {
	mobileOpen: boolean;
	setMobileOpen: (open: boolean) => void;
	setIsClosing: (closing: boolean) => void;
	onMobileCloseComplete?: () => void;
};

const MenuDrawer = ({
	mobileOpen,
	setMobileOpen,
	setIsClosing,
	onMobileCloseComplete,
}: MenuDrawerProps) => {
	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerExited = () => {
		setIsClosing(false);
		if (!mobileOpen) onMobileCloseComplete?.();
	};

	return (
		<>
			<Drawer
				id="mobile-navigation-drawer"
				variant="temporary"
				open={mobileOpen}
				aria-label="mobile-navigation"
				onClose={handleDrawerClose}
				sx={{
					display: { xs: "block", sm: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
				slotProps={{
					root: {
						keepMounted: true, // Better open performance on mobile.
					},
					transition: {
						onExited: handleDrawerExited,
					},
				}}
			>
				<Toolbar />
				<MenuDrawerContent onNavigate={handleDrawerClose} />
			</Drawer>
			<Drawer
				variant="permanent"
				aria-label="desktop-navigation"
				sx={{
					display: { xs: "none", sm: "block" },
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: drawerWidth,
					},
				}}
				slotProps={{
					paper: {
						elevation: 3,
					},
				}}
				open
			>
				<Toolbar />
				<MenuDrawerContent />
			</Drawer>
		</>
	);
};

export { MenuDrawer, type MenuDrawerProps };
