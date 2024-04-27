"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import Alert from "@General/Alert";
import { sendVerificationEmail } from "@Utils/Auth";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
	const [showCondition, setShowCondition] = useState(false);
	const [pending, setPending] = useState(false);

	return (
		<>
			<Button
				variant="ghost"
				color="warning"
				isLoading={pending}
				onClick={async () => {
					setPending(true);
					const status = await sendVerificationEmail();
					if (status) setShowCondition(true);
					setPending(false);
				}}
			>
				Resend verification link
			</Button>
			<Alert
				message="Verification email sent"
				Icon={Mail}
				color="success"
				showCondition={showCondition}
				setShowCondition={setShowCondition}
			/>
		</>
	);
}
