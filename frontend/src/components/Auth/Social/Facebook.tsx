import Link from "next/link";
import { Button } from "@nextui-org/react";
import { FacebookIcon } from "lucide-react";

export default async function Facebook({
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
					pathname: "https://www.facebook.com/v11.0/dialog/oauth",
					query: {
						response_type: "code",
						client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
						redirect_uri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
						scope: "email public_profile",
						state: `callback=${callback}`,
						code_challenge,
						code_challenge_method: "S256",
					},
				} as any
			}
		>
			<FacebookIcon />
		</Button>
	);
}
