import Google from "@Auth/Social/Google";
import Linkedin from "@Auth/Social/Linkedin";
import Facebook from "@Auth/Social/Facebook";
import GitHub from "@Auth/Social/GitHub";
import Twitter from "@Auth/Social/Twitter";
import { getPKCEChallenge } from "@Utils/Auth/oauth";

export default async function Social({ callback }: { callback: string }) {
	const code_challenge = await getPKCEChallenge();

	return (
		<div className="flex justify-center gap-4 mt-4">
			<Google callback={callback} code_challenge={code_challenge} />
			<Linkedin callback={callback} code_challenge={code_challenge} />
			<Facebook callback={callback} code_challenge={code_challenge} />
			<GitHub callback={callback} code_challenge={code_challenge} />
			<Twitter />
		</div>
	);
}
