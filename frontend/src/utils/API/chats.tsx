"use server";

import apiFetch from "@Utils/fetch";
import { experimental_StreamingReactResponse } from "ai";

export async function createChat(chatbot_id: string) {
	const request = await apiFetch("/api/chats/", "POST", { chatbot: chatbot_id }, true);
	return await request.json();
}

export async function getChat(chat_id: string) {
	const request = await apiFetch(`/api/chats/${chat_id}/`, "GET", undefined, true);
	return await request.json();
}

export async function invokeChat(
	{ chat_id }: { chat_id: string },
	prevState: object,
	formData: FormData
) {
	const request = await apiFetch(
		`/api/chats/${chat_id}/invoke/`,
		"POST",
		formData,
		true,
		undefined,
		true
	);
	if (request.status !== 200) return { errors: { form: "An error occurred, please try again" } };
	if (request.body) return new experimental_StreamingReactResponse(request.body);
}
