import Link from "next/link";
import { Link as NextUILink } from "@nextui-org/react";
import { login } from "@Utils/Auth";
import Form from "@Form/Form";
import Input from "@Form/Input";
import Submit from "@Form/Submit";
import { LOGIN_SCHEMA_KEY } from "@Utils/Form/validationSchemas";

export default function LoginForm({ callback }: { callback?: string }) {
	const loginWithCallback = callback ? login.bind(null, { callback }) : login.bind(null, {});

	return (
		<Form
			action={loginWithCallback}
			initialState={{}}
			validationSchema={LOGIN_SCHEMA_KEY}
			className="flex flex-col gap-4"
		>
			<Input name="email" label="Email" placeholder="Enter your email" />
			<Input
				name="password"
				label="Password"
				type="password"
				placeholder="Enter your password"
			/>
			<Submit
				link={
					<NextUILink
						as={Link}
						href="/auth/reset-password"
						color="foreground"
						className="text-right self-end"
					>
						Forgot password?
					</NextUILink>
				}
			>
				Login
			</Submit>
		</Form>
	);
}
