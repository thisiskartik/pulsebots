"use client";

import { useState, useEffect } from "react";
import validateForm from "@Utils/Form/validateForm";

export default function useIfFormError(
	values?: { [name: string]: any },
	validationSchema?: string
) {
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const validate = async (formData: FormData) => {
			if (!validationSchema) {
				return;
			}
			const [isValid, e] = await validateForm(formData, validationSchema);
			setIsError(!isValid);
		};

		if (!values) {
			return;
		}
		const formData = new FormData();
		Object.keys(values).forEach(key => formData.append(key, values[key]));
		validate(formData);
	}, [values, validationSchema]);

	return isError;
}
