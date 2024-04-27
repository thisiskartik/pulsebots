import { cookies } from "next/headers";

export default async function apiFetch(
	urlPath: string,
	method: string = "GET",
	body: object | FormData | undefined = undefined,
	auth: boolean = false,
	cache: RequestCache | undefined = undefined,
	isFormData: boolean = false,
	headers: Headers = new Headers({})
): Promise<Response> {
	if (!isFormData) headers.append("Content-Type", "application/json");

	if (auth) headers.append("Authorization", `Bearer ${cookies().get("access")?.value}`);

	return await fetch(`http://${process.env.API}${urlPath}`, {
		method,
		headers,
		body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
		cache,
	});
}
