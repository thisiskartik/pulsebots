import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { jwtVerify } from "jose";
import apiFetch from "@Utils/fetch";
import { LOGIN_PATH } from "@Utils/Auth/path";

export async function isLoggedIn() {
	const cookiesStore = cookies();

	if (!cookiesStore.has("access") || !cookiesStore.has("refresh")) return false;

	try {
		await jwtVerify(
			cookiesStore.get("access")?.value ?? "",
			new TextEncoder().encode(process.env.TOKEN_SIGNING_KEY)
		);
		return true;
	} catch {
		return false;
	}
}

export function setLoginCookies(cookiesStore: any, access: string, refresh?: string) {
	cookiesStore.set({
		name: "access",
		value: access,
		httpOnly: true,
		path: "/",
	});
	if (refresh)
		cookiesStore.set({
			name: "refresh",
			value: refresh,
			httpOnly: true,
			path: "/",
		});
}

export function deleteLoginCookies(cookiesStore: any) {
	cookiesStore.delete("access");
	cookiesStore.delete("refresh");
}

export function getSessionId() {
	const sessionid = cookies().get("sessionid")?.value;
	if (sessionid) return sessionid;

	return (headers().get("Set-Cookie") as string)
		.split(";")
		.map(function (cookieString) {
			return cookieString.trim().split("=");
		})
		.reduce(function (acc: { [key: string]: string }, curr) {
			acc[curr[0]] = curr[1];
			return acc;
		}, {})["sessionid"];
}

export function setSessionId(response: NextResponse, sessionid?: string) {
	if (sessionid)
		response.cookies.set({
			name: "sessionid",
			value: sessionid,
			path: "/",
		});

	return response;
}

export async function refreshToken(
	request: NextRequest,
	login_redirect_url?: string,
	sessionid?: string
) {
	if (await isLoggedIn()) {
		return setSessionId(NextResponse.next(), sessionid);
	}

	const refreshResponse = await apiFetch(
		"/api/users/token/refresh/",
		"POST",
		{
			refresh: request.cookies.get("refresh")?.value,
		},
		false,
		"no-store"
	);
	if (refreshResponse.status === 401 || refreshResponse.status === 400) {
		const response = setSessionId(
			NextResponse.redirect(
				new URL(login_redirect_url ? login_redirect_url : LOGIN_PATH, process.env.HOST)
			),
			undefined
		);
		deleteLoginCookies(response.cookies);
		return response;
	}

	const { access } = await refreshResponse.json();

	const response = setSessionId(
		NextResponse.redirect(new URL(request.nextUrl.pathname, process.env.HOST as string)),
		undefined
	);
	setLoginCookies(response.cookies, access);

	return response;
}

export async function getUser() {
	const request = await apiFetch("/api/users/", "GET", undefined, true);
	return await request.json();
}
