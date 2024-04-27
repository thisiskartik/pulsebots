import { NextRequest } from "next/server";
import { oauthAuthorizatioCodeFlow } from "@Utils/Auth/oauth";

export async function GET(request: NextRequest) {
	return oauthAuthorizatioCodeFlow(
		request,
		"https://graph.facebook.com/v11.0/oauth/access_token",
		"/api/users/oauth/facebook/",
		process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI,
		process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
		process.env.FACEBOOK_CLIENT_SECRET
	);
}
