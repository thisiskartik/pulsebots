"use client";

import { Children, isValidElement, cloneElement } from "react";

export default function FormGroup({
	children,
	state,
	validationSchema,
	className,
	values,
	setValues,
}: {
	children: React.ReactNode;
	state?: any;
	validationSchema?: string;
	className?: string;
	values?: { [name: string]: any };
	setValues?: React.Dispatch<React.SetStateAction<object>>;
}) {
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
	return <div className={className}>{childrenWithState}</div>;
}
