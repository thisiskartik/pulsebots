"use client";

import { forwardRef } from "react";
import type { ForwardedRef } from "react";
import { Input as NextUIInput } from "@nextui-org/react";
import useFieldError from "@Utils/Form/useFieldError";
import type { InputProps } from "@nextui-org/react";
import type { FieldProps } from "@Form/Form";

const Input = (
	{
		name,
		label,
		hideError,
		state,
		validationSchema,
		values,
		setValues,
		...props
	}: FieldProps & InputProps,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { inputFieldProps, error } = useFieldError(
		name,
		state,
		values,
		setValues,
		validationSchema
	);

	return (
		<NextUIInput
			ref={ref}
			type="text"
			id={name}
			name={name}
			label={label}
			defaultValue={name && values && values[name]}
			onChange={inputFieldProps?.onChange}
			onBlur={inputFieldProps?.onBlur}
			onKeyDown={inputFieldProps?.onKeyDown}
			isInvalid={error && !hideError ? true : false}
			errorMessage={hideError ? undefined : error}
			{...props}
		/>
	);
};

export default forwardRef(Input);
