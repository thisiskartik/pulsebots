"use client";

import { useEffect } from "react";
import useFieldError from "@Utils/Form/useFieldError";
import Error from "@Form/Error";
import type { FieldProps } from "@Form/Form";

interface Props extends FieldProps {
	label: string;
	options: Array<{ label: string; value: string }>;
}

export default function Checkboxes({
	name,
	state,
	validationSchema,
	values,
	setValues,
	label,
	options,
}: Props) {
	const { inputFieldProps, error } = useFieldError(
		name,
		state,
		values,
		setValues,
		validationSchema
	);

	useEffect(() => {
		if (setValues && values && name) {
			setValues({ ...values, [name]: "[]" });
		}
	}, []);

	return (
		<div>
			<label htmlFor={name}>{label}</label>
			{options.map(option => (
				<div key={option.value}>
					<input
						type="checkbox"
						id={option.value}
						value={option.value}
						onChange={inputFieldProps?.onChangeCheckbox(option)}
					/>
					<label htmlFor={option.value}>{option.label}</label>
				</div>
			))}
			<input
				type="hidden"
				name={name}
				value={values && name && JSON.stringify(values[name] ?? "[]")}
			/>
			<Error error={error} />
		</div>
	);
}
