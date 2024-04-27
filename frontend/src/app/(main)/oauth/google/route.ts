import { NextRequest } from "next/server";
import { oauthAuthorizatioCodeFlow } from "@Utils/Auth/oauth";

export async function GET(request: NextRequest) {
	return oauthAuthorizatioCodeFlow(
		request,
		"https://oauth2.googleapis.com/token",
		"/api/users/oauth/google/",
		process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
		process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET
	);
}
