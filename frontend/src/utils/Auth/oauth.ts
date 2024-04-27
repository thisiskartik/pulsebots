import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import apiFetch from "@Utils/fetch";
import { setLoginCookies, getSessionId } from "@Utils/Auth/helper";
import { LOGIN_PATH, REDIRECT_IF_ALREADY_LOGGED_IN_PATH } from "@Utils/Auth/path";

export async function getPKCEChallenge() {
	const pkceCodeChallengeReq = await apiFetch(
		"/api/users/oauth/generate_pkce_challenge/",
		"POST",
		{
			session_id: getSessionId(),
		}
	);
	const { code_challenge } = await pkceCodeChallengeReq.json();
	return code_challenge;
}

export async function getPKCEVerifier(request: NextRequest) {
	const codeVerifierReq = await apiFetch("/api/users/oauth/get_pkce_verifier/", "POST", {
		session_id: request.cookies.get("sessionid")?.value,
	});
	if (codeVerifierReq.status !== 200)
		return NextResponse.redirect(new URL(LOGIN_PATH, process.env.HOST));
	const { code_verifier } = await codeVerifierReq.json();
	return code_verifier;
}

export async function oauthAuthorizatioCodeFlow(
	request: NextRequest,
	access_token_endpoint: string,
	sign_in_endpoint: string,
	redirect_uri?: string,
	client_id?: string,
	client_secret?: string
) {
	const { searchParams } = new URL(request.url);

	if (!searchParams.has("code"))
		return NextResponse.redirect(new URL(LOGIN_PATH, process.env.HOST));

	const code_verifier = await getPKCEVerifier(request);

	const params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", searchParams.get("code") as string);
	params.append("redirect_uri", redirect_uri as string);
	// Code Verifier not working in linkedin
	if (client_id !== process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID)
		params.append("code_verifier", code_verifier);
	params.append("client_id", client_id as string);
	params.append("client_secret", client_secret as string);

	const authorizationCodeReq = await fetch(`${access_token_endpoint}?${params.toString()}`, {
		method: "POST",
		headers: { Accept: "application/json" },
	});
	if (authorizationCodeReq.status !== 200)
		return NextResponse.redirect(new URL(LOGIN_PATH, process.env.HOST));
	const { access_token } = await authorizationCodeReq.json();

	const signInReq = await apiFetch(sign_in_endpoint, "POST", {
		access_token,
	});
	if (!(signInReq.status === 200 || signInReq.status === 201))
		return NextResponse.redirect(new URL(LOGIN_PATH, process.env.HOST));
	const { access, refresh } = await signInReq.json();

	const callback = searchParams.get("state")?.startsWith("callback=")
		? (searchParams.get("state")?.split("callback=")[1] as string)
		: REDIRECT_IF_ALREADY_LOGGED_IN_PATH;
	const response = NextResponse.redirect(new URL(callback, process.env.HOST));
	setLoginCookies(response.cookies, access, refresh);

	return response;
}
