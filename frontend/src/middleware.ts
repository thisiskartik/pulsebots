import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
	PROTECTED_PATH,
	LOGIN_PATH,
	AUTH_PATH,
	REDIRECT_IF_ALREADY_LOGGED_IN_PATH,
} from "@Utils/Auth/path";
import { setSessionId, refreshToken } from "@Utils/Auth/helper";

export async function middleware(request: NextRequest) {
	let sessionid: string | undefined;
	if (!request.cookies.has("sessionid")) {
		const N = 64;
		const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		sessionid = Array(N)
			.join()
			.split(",")
			.map(() => s.charAt(Math.floor(Math.random() * s.length)))
			.join("");
	}

	const currentPath = request.nextUrl.pathname;
	const protected_path_regex = new RegExp(PROTECTED_PATH, "i");
	const auth_path_regex = new RegExp(AUTH_PATH, "i");
	const login_redirect_url = `${LOGIN_PATH}?callback=${currentPath}`;

	if (protected_path_regex.test(currentPath)) {
		if (!request.cookies.has("access") || !request.cookies.has("refresh"))
			return setSessionId(
				NextResponse.redirect(new URL(login_redirect_url, process.env.HOST)),
				sessionid
			);

		return refreshToken(request, login_redirect_url, sessionid);
	} else if (
		auth_path_regex.test(currentPath) &&
		request.cookies.has("access") &&
		request.cookies.has("refresh") &&
		(request.cookies.get("access")?.value ?? "" !== "") &&
		(request.cookies.get("refresh")?.value ?? "" !== "")
	) {
		return setSessionId(
			NextResponse.redirect(new URL(REDIRECT_IF_ALREADY_LOGGED_IN_PATH, process.env.HOST)),
			undefined
		);
	} else if (
		(request.cookies.has("access") || request.cookies.has("refresh")) &&
		(request.cookies.get("access")?.value ?? "" !== "") &&
		(request.cookies.get("refresh")?.value ?? "" !== "")
	) {
		return refreshToken(request, undefined, sessionid);
	} else {
		return setSessionId(NextResponse.next(), sessionid);
	}
}

export const config = {
	matcher: "/(.*)",
};
