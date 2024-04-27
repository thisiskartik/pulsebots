"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import apiFetch from "@Utils/fetch";
import { setLoginCookies, deleteLoginCookies } from "@Utils/Auth/helper";
import { LOGIN_PATH, REDIRECT_IF_ALREADY_LOGGED_IN_PATH, PROTECTED_PATH } from "@Utils/Auth/path";
import validateForm from "@Utils/Form/validateForm";
import {
	LOGIN_SCHEMA_KEY,
	REGISTRATION_SCHEMA_KEY,
	RESET_PASSWORD_EMAIL_SCHEMA_KEY,
	RESET_PASSWORD_SCHEMA_KEY,
} from "@Utils/Form/validationSchemas";

export async function register(prevState: object, formData: FormData) {
	const [isValid, errors] = await validateForm(formData, REGISTRATION_SCHEMA_KEY);
	if (!isValid) return { errors };

	const response = await apiFetch("/api/users/register/", "POST", Object.fromEntries(formData));
	const data = await response.json();
	if (response.status !== 201) return { errors: { form: data.error } };

	return { success: "Successfully registered" };
}

export async function login(
	{ callback }: { callback?: string },
	prevState: object,
	formData: FormData
) {
	const [isValid, errors] = await validateForm(formData, LOGIN_SCHEMA_KEY);
	if (!isValid) return { errors };

	const request = await apiFetch(
		"/api/users/token/",
		"POST",
		{ email: formData.get("email"), password: formData.get("password") },
		false,
		"no-store"
	);
	if (request.status === 401) return { errors: { form: "Invalid Credentials" } };

	const { access, refresh } = await request.json();
	const cookiesStore = cookies();
	setLoginCookies(cookiesStore, access, refresh);

	if (callback) redirect(callback);
	else redirect(REDIRECT_IF_ALREADY_LOGGED_IN_PATH);
}

export async function logout() {
	const cookiesStore = cookies();

	await apiFetch(
		"/api/users/token/revoke/",
		"POST",
		{ refresh: cookiesStore.get("refresh")?.value },
		false,
		"no-store"
	);

	deleteLoginCookies(cookiesStore);

	const currentPath = new URL(headers().get("referer") as string).pathname;
	if (new RegExp(PROTECTED_PATH).test(currentPath))
		redirect(`${LOGIN_PATH}?callback=${currentPath}`);
}

export async function sendVerificationEmail() {
	const request = await apiFetch("/api/users/verify_email/", "POST", undefined, true, "no-store");
	if (request.status !== 200) return false;
	return true;
}

export async function verifyEmail(token: string, id: string) {
	const request = await apiFetch(
		"/api/users/verify_email/",
		"POST",
		{
			token,
			id,
		},
		false,
		"no-store"
	);
	if (request.status !== 200) return false;
	revalidatePath("/");
	return true;
}

export async function sendResetPasswordLink(prevState: object, formData: FormData) {
	const [isValid, errors] = await validateForm(formData, RESET_PASSWORD_EMAIL_SCHEMA_KEY);
	if (!isValid) return { errors };

	const passwordResetRequest = await apiFetch(
		"/api/users/reset_password/",
		"POST",
		{
			email: formData.get("email"),
		},
		false,
		"no-store"
	);
	const data = await passwordResetRequest.json();
	if (passwordResetRequest.status !== 200) return { errors: { form: data.error } };

	return { success: "Successfully sent reset password link" };
}

export async function resetPassword(
	{ token, id }: { token: string; id: string },
	prevState: object,
	formData: FormData
) {
	const [isValid, errors] = await validateForm(formData, RESET_PASSWORD_SCHEMA_KEY);
	if (!isValid) return { errors };

	const passwordResetRequest = await apiFetch(
		"/api/users/reset_password/",
		"POST",
		{
			token,
			id,
			password: formData.get("password"),
		},
		false,
		"no-store"
	);
	const data = await passwordResetRequest.json();
	if (passwordResetRequest.status !== 200) return { errors: { form: data.error } };

	return { success: "Successfully changed password" };
}
