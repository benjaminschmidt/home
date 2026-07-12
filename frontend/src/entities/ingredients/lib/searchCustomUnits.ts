import type { CustomUnitDto } from "home-api";

const findCustomUnit = (
	customUnits: CustomUnitDto[],
	unit: string,
	errorContext?: string[],
) => {
	const matchingUnits = customUnits.filter((u) => u.name === unit);
	if (matchingUnits.length > 1) {
		throw new Error(`Multiple custom units found with name "${unit}".`);
	}
	const customUnit = matchingUnits?.[0];
	if (customUnit === undefined) {
		errorContext?.push(`Custom unit ${unit} is missing.`);
	}

	return customUnit;
};

export { findCustomUnit };
