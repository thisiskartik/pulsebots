"use server";

import { revalidatePath } from "next/cache";
import validateForm from "@Utils/Form/validateForm";
import { CREATE_CHATBOT_SCHEMA_KEY, EDIT_CHATBOT_SCHEMA_KEY } from "@Utils/Form/validationSchemas";
import apiFetch from "@Utils/fetch";

export async function getChatBots() {
	const request = await apiFetch("/api/chatbots/", "GET", undefined, true);
	return await request.json();
}

export async function getChatBot(id: string) {
	const request = await apiFetch(`/api/chatbots/${id}/`, "GET", undefined, true);
	return await request.json();
}

export async function createChatBot(prevState: object, formData: FormData) {
	const [isValid, errors] = await validateForm(formData, CREATE_CHATBOT_SCHEMA_KEY);
	if (!isValid) return { errors };

	const request = await apiFetch("/api/chatbots/", "POST", formData, true, undefined, true);
	if (request.status !== 201) {
		console.log(await request.json());
		return { errors: { form: "An error occurred, please try again" } };
	}
	const response = await request.json();

	formData.getAll("startprompts").forEach(startprompt => {
		if (startprompt) {
			(async () => {
				await apiFetch(
					`/api/chatbots/${response.id}/startprompts/`,
					"POST",
					{ message: startprompt },
					true
				);
			})();
		}
	});

	revalidatePath("/dashboard/chatbots");
	return { success: "Successfully created chatbot" };
}

export async function updateChatBot(
	{ id, start_prompts }: { id: string; start_prompts: Array<{ id: string; message: string }> },
	prevState: object,
	formData: FormData
) {
	console.log(formData);
	const [isValid, errors] = await validateForm(formData, EDIT_CHATBOT_SCHEMA_KEY);
	if (!isValid) return { errors };

	if ((formData.get("icon") as File).name === "undefined") formData.delete("icon");

	const request = await apiFetch(`/api/chatbots/${id}/`, "PUT", formData, true, undefined, true);
	if (request.status !== 200) return { errors: { form: "An error occurred, please try again" } };

	formData.getAll("startprompts").forEach((startprompt, i) => {
		if (startprompt) {
			if (start_prompts[i]) {
				(async () => {
					await apiFetch(
						`/api/chatbots/${id}/startprompts/${start_prompts[i].id}/`,
						"PUT",
						{ message: startprompt },
						true
					);
				})();
			} else {
				(async () => {
					await apiFetch(
						`/api/chatbots/${id}/startprompts/`,
						"POST",
						{ message: startprompt },
						true
					);
				})();
			}
		} else if (start_prompts[i]) {
			(async () => {
				await apiFetch(
					`/api/chatbots/${id}/startprompts/${start_prompts[i].id}/`,
					"DELETE",
					undefined,
					true
				);
			})();
		}
	});

	revalidatePath("/dashboard/chatbots");
	return { success: "Successfully updated chatbot" };
}

export async function deleteChatBot(id: string) {
	await apiFetch(`/api/chatbots/${id}/`, "DELETE", undefined, true);
	revalidatePath("/dashboard/chatbots");
}
