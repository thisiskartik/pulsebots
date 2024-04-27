import { Divider } from "@nextui-org/react";
import Card from "@General/Card";
import Login from "@Auth/Login";
import Social from "@Auth/Social";
import { REDIRECT_IF_ALREADY_LOGGED_IN_PATH } from "@Utils/Auth/path";

export default function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
	const callback = searchParams?.callback ?? REDIRECT_IF_ALREADY_LOGGED_IN_PATH;

	return (
		<Card header={<h2 className="font-bold text-3xl">Login</h2>}>
			<Login callback={callback} />
			<Divider className="my-8" />
			<div>
				<p className="text-center font-thin text-sm">Login using social networks</p>
				<Social callback={callback} />
			</div>
		</Card>
	);
}
