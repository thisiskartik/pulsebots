import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import apiFetch from "@Utils/fetch";
import { sendOAuth10aAuthorizedRequest } from "@Utils/Auth/oauth10a";
import { setLoginCookies } from "@Utils/Auth/helper";
import { LOGIN_PATH, REDIRECT_IF_ALREADY_LOGGED_IN_PATH } from "@Utils/Auth/path";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	if (!searchParams.has("oauth_verifier"))
		return NextResponse.redirect(new URL(LOGIN_PATH, process.env.HOST));

	const oauthTokenRequest = await apiFetch(
		"/api/users/oauth/twitter/get_twitter_oauth_token/",
		"POST",
		{
			session_id: request.cookies.get("sessionid")?.value,
		}
	);
	const { oauth_token } = await oauthTokenRequest.json();

	if (searchParams.get("oauth_token") !== oauth_token)
		return NextResponse.redirect(new URL(LOGIN_PATH, process.env.HOST));

	const accessTokenResponse = await sendOAuth10aAuthorizedRequest(
		{
			oauth_consumer_key: process.env.TWITTER_CONSUMER_API_KEY as string,
			oauth_token,
			oauth_verifier: searchParams.get("oauth_verifier"),
		},
		"https://api.twitter.com/oauth/access_token"
	);

	const signInRequest = await apiFetch("/api/users/oauth/twitter/", "POST", {
		oauth_token: accessTokenResponse.get("oauth_token"),
		oauth_token_secret: accessTokenResponse.get("oauth_token_secret"),
	});
	const { access, refresh } = await signInRequest.json();

	const response = NextResponse.redirect(
		new URL(REDIRECT_IF_ALREADY_LOGGED_IN_PATH, process.env.HOST)
	);
	setLoginCookies(response.cookies, access, refresh);

	return response;
}
