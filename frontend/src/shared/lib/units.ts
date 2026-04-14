export const getReadableUnitName = (unit: string) => {
	switch (unit) {
		case "GRAM":
			return "g";
		default:
			return unit;
	}
};
