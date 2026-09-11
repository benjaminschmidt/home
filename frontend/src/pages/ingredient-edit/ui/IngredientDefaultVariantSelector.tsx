import type { IngredientVariantDto } from "home-api";
import { getIngredientVariantOptions } from "@/entities/ingredients";
import { NO_DEFAULT_VARIANT } from "@/pages/ingredient-edit/model/ingredientFormSchema.ts";
import { SelectField, type SelectFieldItem } from "@/shared/ui/form";

type IngredientDefaultVariantSelectorProps = {
	handleChange: (value: string) => void;
	value: string;
	variants: IngredientVariantDto[];
};

const IngredientDefaultVariantSelector = ({
	handleChange,
	value,
	variants,
}: IngredientDefaultVariantSelectorProps) => {
	const variantOptions = getIngredientVariantOptions(variants);
	const items: SelectFieldItem[] = [
		{
			type: "option",
			key: NO_DEFAULT_VARIANT,
			value: NO_DEFAULT_VARIANT,
			label: "None",
		},
		...variantOptions.map(
			(option): SelectFieldItem => ({
				type: "option",
				key: option.id,
				value: option.id,
				label: option.value,
			}),
		),
	];

	return (
		<SelectField
			label="Default variant"
			value={value}
			handleChange={handleChange}
			items={items}
		/>
	);
};

export { IngredientDefaultVariantSelector };
