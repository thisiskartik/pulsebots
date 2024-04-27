import { Divider } from "@nextui-org/react";
import Card from "@General/Card";
import Social from "@Auth/Social";
import Register from "@Auth/Register";
import { REDIRECT_IF_ALREADY_LOGGED_IN_PATH } from "@Utils/Auth/path";

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
	const callback = searchParams?.callback ?? REDIRECT_IF_ALREADY_LOGGED_IN_PATH;

	return (
		<Card header={<h2 className="font-bold text-3xl">Sign up</h2>}>
			<Register />
			<Divider className="my-8" />
			<div>
				<p className="text-center font-thin text-sm">Sign up using social networks</p>
				<Social callback={callback} />
			</div>
		</Card>
	);
}
