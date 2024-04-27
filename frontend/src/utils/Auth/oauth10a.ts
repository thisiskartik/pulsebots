import OAuth from "oauth-1.0a";
import { createHmac } from "crypto";
import { getSessionId } from "./helper";
import apiFetch from "@Utils/fetch";

export async function getOauth10aToken() {
	const oauth10aTokenReq = await apiFetch(
		"/api/users/oauth/twitter/generate_twitter_oauth_tokens/",
		"POST",
		{
			session_id: getSessionId(),
		}
	);
	const { oauth_token } = await oauth10aTokenReq.json();

	return oauth_token;
}

export async function sendOAuth10aAuthorizedRequest(
	data: object,
	url: string,
	method: string = "POST"
) {
	const oauth = new OAuth({
		consumer: {
			key: process.env.TWITTER_CONSUMER_API_KEY as string,
			secret: process.env.TWITTER_CONSUMER_API_KEY_SECRET as string,
		},
		signature_method: "HMAC-SHA1",
		hash_function(base_string, key) {
			return createHmac("sha1", key).update(base_string).digest("base64");
		},
	});
	const Authorization = oauth.toHeader(
		oauth.authorize(
			{
				url,
				method,
				data,
			},
			{
				key: process.env.TWITTER_ACCESS_TOKEN as string,
				secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
			}
		)
	).Authorization;

	const request = await fetch(url, {
		method,
		headers: {
			Authorization,
		},
		body: JSON.stringify(data),
	});

	return new URLSearchParams(await request.text());
}
