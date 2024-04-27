"use client";

import { Textarea as NextUITextarea } from "@nextui-org/react";
import useFieldError from "@Utils/Form/useFieldError";
import type { TextAreaProps } from "@nextui-org/react";
import type { FieldProps } from "@Form/Form";

export default function Textarea({
	name,
	label,
	state,
	validationSchema,
	values,
	setValues,
	...props
}: FieldProps & TextAreaProps) {
	const { inputFieldProps, error } = useFieldError(
		name,
		state,
		values,
		setValues,
		validationSchema
	);

	return (
		<NextUITextarea
			id={name}
			name={name}
			label={label}
			defaultValue={name && values && values[name]}
			onChange={inputFieldProps?.onChange}
			onBlur={inputFieldProps?.onBlur}
			onKeyDown={inputFieldProps?.onKeyDown}
			isInvalid={error ? true : false}
			errorMessage={error}
			{...props}
		/>
	);
}
