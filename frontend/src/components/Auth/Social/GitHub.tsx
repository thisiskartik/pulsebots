import Link from "next/link";
import { Button } from "@nextui-org/react";
import { GithubIcon } from "lucide-react";

export default async function GitHub({
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
					pathname: "https://github.com/login/oauth/authorize",
					query: {
						response_type: "code",
						client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
						redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
						state: `callback=${callback}`,
						scope: "read:user,user:email",
						code_challenge,
						code_challenge_method: "S256",
					},
				} as any
			}
		>
			<GithubIcon />
		</Button>
	);
}
