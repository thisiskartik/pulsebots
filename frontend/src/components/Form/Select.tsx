"use client";

import { useEffect } from "react";
import { Select as NextUISelect, SelectItem, SelectSection } from "@nextui-org/react";
import useFieldError from "@Utils/Form/useFieldError";
import type { SelectProps } from "@nextui-org/react";
import type { FieldProps } from "@Form/Form";

interface Option {
	label: string;
	value: string;
}

interface Props extends Omit<FieldProps, "label">, Omit<SelectProps, "children"> {
	defaultValue?: Array<string>;
	options?: Array<Option>;
	optionsWithTypes?: Array<{ type: string; options: Array<Option> }>;
}

export default function Select({
	name,
	state,
	validationSchema,
	values,
	setValues,
	options,
	optionsWithTypes,
	defaultValue,
	...props
}: Props) {
	const { inputFieldProps, error } = useFieldError(
		name,
		state,
		values,
		setValues,
		validationSchema
	);

	const finalProps = {
		name,
		defaultSelectedKeys: name && values && values[name] && values[name].split(","),
		onChange: inputFieldProps?.onChange,
		onClose: inputFieldProps?.onBlur,
		errorMessage: error ? error : "",
		isInvalid: error ? true : false,
		...props,
	};

	if (options) {
		return (
			<NextUISelect items={options} {...finalProps}>
				{(option: any) => <SelectItem key={option.value}>{option.label}</SelectItem>}
			</NextUISelect>
		);
	} else if (optionsWithTypes) {
		return (
			<NextUISelect {...finalProps}>
				{optionsWithTypes.map(optionsType => (
					<SelectSection key={optionsType.type}>
						{optionsType.options.map(option => (
							<SelectItem key={option.value}>{option.label}</SelectItem>
						))}
					</SelectSection>
				))}
			</NextUISelect>
		);
	}
}
