"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Form from "@Form/Form";
import Input from "@Form/Input";
import Submit from "@Form/Submit";
import FormGroup from "@Form/FormGroup";
import Alert from "@General/Alert";
import { register } from "@Utils/Auth";
import { REGISTRATION_SCHEMA_KEY } from "@Utils/Form/validationSchemas";
import { LOGIN_PATH } from "@Utils/Auth/path";
import { Check } from "lucide-react";

export default function Register() {
	const router = useRouter();
	const [showCondition, setShowCondition] = useState(false);
	const onSuccess = useCallback(() => {
		setShowCondition(true);
	}, []);

	return (
		<>
			<Form
				action={register}
				initialState={{}}
				validationSchema={REGISTRATION_SCHEMA_KEY}
				className="flex flex-col gap-4"
				onSuccess={onSuccess}
			>
				<FormGroup className="flex gap-4">
					<Input
						name="first_name"
						label="First Name"
						placeholder="Enter your First Name"
					/>
					<Input name="last_name" label="Last Name" placeholder="Enter your Last Name" />
				</FormGroup>
				<Input name="email" label="Email" placeholder="Enter your Email Address" />
				<Input
					name="password"
					type="password"
					label="Password"
					placeholder="Enter your Password"
				/>
				<Submit>Sign up</Submit>
			</Form>
			<Alert
				message="Registration successful"
				Icon={Check}
				color="success"
				onClose={() => router.push(LOGIN_PATH)}
				showCondition={showCondition}
				setShowCondition={setShowCondition}
			/>
		</>
	);
}
