"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Form from "@Form/Form";
import Input from "@Form/Input";
import Submit from "@Form/Submit";
import {
	RESET_PASSWORD_EMAIL_SCHEMA_KEY,
	RESET_PASSWORD_SCHEMA_KEY,
} from "@Utils/Form/validationSchemas";
import { LOGIN_PATH } from "@Utils/Auth/path";
import { sendResetPasswordLink, resetPassword } from "@Utils/Auth";
import Alert from "@General/Alert";
import { Mail, Check } from "lucide-react";

export function ResetPassword({ token, id }: { token: string; id: string }) {
	const router = useRouter();
	const [showCondition, setShowCondition] = useState(false);
	const onSuccess = useCallback(() => {
		setShowCondition(true);
	}, []);

	const resetPasswordWithSearchParams = resetPassword.bind(null, {
		token,
		id,
	});

	return (
		<>
			<Form
				action={resetPasswordWithSearchParams}
				initialState={{}}
				validationSchema={RESET_PASSWORD_SCHEMA_KEY}
				className="flex flex-col gap-4"
				onSuccess={onSuccess}
			>
				<Input name="password" type="password" label="Password" placeholder="Password" />
				<Input
					name="confirm_password"
					type="password"
					label="Confirm Password"
					placeholder="Confirm Password"
				/>
				<Submit>Reset password</Submit>
			</Form>
			<Alert
				message="Password changed successfully"
				Icon={Check}
				color="success"
				onClose={() => router.push(LOGIN_PATH)}
				showCondition={showCondition}
				setShowCondition={setShowCondition}
			/>
		</>
	);
}

export function SendResetPasswordLink() {
	const [showCondition, setShowCondition] = useState(false);
	const onSuccess = useCallback(() => {
		setShowCondition(true);
	}, []);

	return (
		<>
			<Form
				action={sendResetPasswordLink}
				initialState={{}}
				validationSchema={RESET_PASSWORD_EMAIL_SCHEMA_KEY}
				className="flex flex-col gap-4"
				onSuccess={onSuccess}
			>
				<Input name="email" label="Email Address" placeholder="Enter your Email Address" />
				<Submit>Send reset password link</Submit>
			</Form>
			<Alert
				message="Password reset link sent to your email address"
				Icon={Mail}
				color="success"
				showCondition={showCondition}
				setShowCondition={setShowCondition}
			/>
		</>
	);
}
