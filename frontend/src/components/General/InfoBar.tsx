import { getUser } from "@Utils/Auth/helper";
import VerifyEmail from "@Auth/VerifyEmail";

export default async function InfoBar() {
	const { is_email_verified, email } = await getUser();

	if (!is_email_verified)
		return (
			<div className="bg-warning-50 text-warning-400 py-4 px-6 flex justify-center">
				<div className="max-w-[1024px] w-full px-6 flex justify-between items-center">
					<p>
						Your email is not verified. An email is sent to{" "}
						<span className="font-medium">{email}</span> with verification link
					</p>
					<VerifyEmail />
				</div>
			</div>
		);
}
