import Link from "next/link";
import { Button } from "@nextui-org/react";
import { LinkedinIcon } from "lucide-react";

export default async function Linkedin({
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
					pathname: "https://linkedin.com/oauth/v2/authorization",
					query: {
						response_type: "code",
						client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
						redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
						scope: "openid email profile",
						state: `callback=${callback}`,
						code_challenge,
						code_challenge_method: "S256",
					},
				} as any
			}
		>
			<LinkedinIcon />
		</Button>
	);
}
