import { NextRequest } from "next/server";
import { oauthAuthorizatioCodeFlow } from "@Utils/Auth/oauth";

export async function GET(request: NextRequest) {
	return oauthAuthorizatioCodeFlow(
		request,
		"https://github.com/login/oauth/access_token",
		"/api/users/oauth/github/",
		process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
		process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
		process.env.GITHUB_CLIENT_SECRET
	);
}
