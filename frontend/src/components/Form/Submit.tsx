"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";
import type { ButtonProps } from "@nextui-org/react";
import type { FieldProps } from "@Form/Form";
import useIsFormError from "@Utils/Form/useIsFormError";

interface Props extends ButtonProps, FieldProps {
	children: React.ReactNode;
	link?: React.ReactNode;
	customLoading?: boolean;
}

export default function Submit({
	children,
	link,
	state,
	values,
	setValues,
	validationSchema,
	customLoading,
	...props
}: Props) {
	const { pending } = useFormStatus();
	const isFormError = useIsFormError(values, validationSchema);
	return (
		<div className="flex flex-col gap-1">
			<Button
				type="submit"
				isDisabled={isFormError}
				isLoading={pending || customLoading}
				color="primary"
				{...props}
			>
				{children}
			</Button>
			{link}
		</div>
	);
}
