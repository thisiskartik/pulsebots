"use client";

import { useEffect, useState, Children, isValidElement, cloneElement, forwardRef } from "react";
import type { ForwardedRef } from "react";
import { useFormState } from "react-dom";
import Error from "@Form/Error";

export interface FieldProps {
	name?: string;
	label?: string;
	hideError?: boolean;
	state?: any;
	validationSchema?: string;
	values?: { [name: string]: any };
	setValues?: React.Dispatch<React.SetStateAction<object>>;
}

const Form = (
	{
		children,
		action,
		initialState,
		validationSchema,
		onSuccess,
		onSubmit,
		className,
	}: {
		children: React.ReactNode;
		action: (prevState: object, formData: FormData) => Promise<any>;
		initialState: any;
		validationSchema: string;
		onSuccess?: Function;
		onSubmit?: React.FormEventHandler<HTMLFormElement>;
		className?: string;
	},
	ref: ForwardedRef<HTMLFormElement>
) => {
	const [state, formAction] = useFormState(action, initialState);
	const [values, setValues] = useState(initialState);

	useEffect(() => {
		setValues(initialState);
	}, []);

	useEffect(() => {
		if (state && ("success" in state || "content" in state) && onSuccess) {
			onSuccess(state);
		}
	}, [state, onSuccess]);

	const childrenWithState = Children.map(children, child => {
		if (isValidElement(child)) {
			return cloneElement(child, {
				...child.props,
				state,
				validationSchema,
				values,
				setValues,
			});
		}
		return child;
	});
	return (
		<form action={formAction} onSubmit={onSubmit} className={className} ref={ref}>
			<Error error={state?.errors?.form} />
			{childrenWithState}
		</form>
	);
};

export default forwardRef(Form);
