"use client";

import { useEffect, useState } from "react";
import { validateField } from "@Utils/Form/validateForm";

export default function useFieldError(
	name?: string,
	state?: any,
	values?: { [name: string]: any },
	setValues?: React.Dispatch<React.SetStateAction<object>>,
	validationSchema?: string
) {
	const [clientValidation, setClientValidation] = useState(false);
	const [isKeyPressed, setIsKeyPressed] = useState(false);
	const [clientError, setClientError] = useState<string | undefined>();

	useEffect(() => {
		if (name && state && state?.errors && state?.errors[name] && isKeyPressed)
			setClientValidation(true);
	}, [name, isKeyPressed, state]);

	useEffect(() => {
		if (clientValidation && validationSchema && values && name) {
			validateField(validationSchema, name, values, setClientError);
		}
	}, [name, values, validationSchema, clientValidation]);

	const error =
		clientValidation && clientError
			? clientError
			: name && state?.errors && state?.errors[name];
	return name && values && setValues
		? {
				inputFieldProps: {
					onChange: (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
						// @ts-ignore
						setValues({ ...values, [name]: e.target.value });
					},
					onBlur: () => setClientValidation(true),
					onKeyDown: () => setIsKeyPressed(true),
					onChangeCheckbox:
						(option: { label: string; value: string }) =>
						(e: React.ChangeEvent<HTMLInputElement>) => {
							setClientValidation(true);
							if (e.target.checked && setValues && values && name)
								setValues({
									...values,
									[name]: JSON.stringify([
										...JSON.parse(values[name] ?? "[]"),
										option.value,
									]),
								});
							else if (setValues && values && name)
								setValues({
									...values,
									[name]: JSON.stringify(
										JSON.parse(values[name] ?? "[]").filter(
											(v: string) => v !== option.value
										)
									),
								});
						},
				},
				error,
		  }
		: { error };
}
