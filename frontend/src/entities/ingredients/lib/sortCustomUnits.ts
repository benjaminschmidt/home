import type { CustomUnitDto } from "home-api";

const sortCustomUnits = (customUnits: CustomUnitDto[]): CustomUnitDto[] =>
	[...customUnits].sort((left, right) => left.name.localeCompare(right.name));

export { sortCustomUnits };
