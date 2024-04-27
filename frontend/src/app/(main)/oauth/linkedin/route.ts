import { NextRequest } from "next/server";
import { oauthAuthorizatioCodeFlow } from "@Utils/Auth/oauth";

export async function GET(request: NextRequest) {
	return oauthAuthorizatioCodeFlow(
		request,
		"https://www.linkedin.com/oauth/v2/accessToken",
		"/api/users/oauth/linkedin/",
		process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI,
		process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
		process.env.LINKEDIN_CLIENT_SECRET
	);
}
