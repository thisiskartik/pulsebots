import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import GoogleIcon from "@Public/google.svg";

export default async function Google({
	callback,
	code_challenge,
}: {
	callback: string;
	code_challenge: string;
}) {
	return (
		<Button
			as={Link}
			isIconOnly
			variant="ghost"
			size="lg"
			radius="full"
			href={
				{
					pathname: "https://accounts.google.com/o/oauth2/v2/auth",
					query: {
						response_type: "code",
						client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
						redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
						scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
						state: `callback=${callback}`,
						code_challenge,
						code_challenge_method: "S256",
					},
				} as any
			}
		>
			<Image src={GoogleIcon} alt="Sign in with Google" priority />
		</Button>
	);
}
