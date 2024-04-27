import Card from "@General/Card";
import { ResetPassword, SendResetPasswordLink } from "@Auth/ResetPassword";

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
	return (
		<Card header={<h2 className="font-bold text-3xl">Reset Password</h2>}>
			{searchParams?.token && searchParams?.id ? (
				<ResetPassword token={searchParams.token} id={searchParams.id} />
			) : (
				<SendResetPasswordLink />
			)}
		</Card>
	);
}
