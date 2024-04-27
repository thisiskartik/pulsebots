import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { getOauth10aToken } from "@Utils/Auth/oauth10a";
import TwitterIcon from "@Public/twitter.svg";

export default async function Twitter() {
	const oauth_token = await getOauth10aToken();

	return (
		<Button
			as={Link}
			isIconOnly
			variant="ghost"
			size="lg"
			radius="full"
			href={
				{
					pathname: "https://api.twitter.com/oauth/authorize",
					query: { oauth_token },
				} as any
			}
		>
			<Image src={TwitterIcon} alt="Sign in with X" width={24} height={24} priority />
		</Button>
	);
}
