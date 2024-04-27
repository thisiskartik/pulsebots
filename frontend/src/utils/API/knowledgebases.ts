"use server";

import { revalidatePath } from "next/cache";
import validateForm from "@Utils/Form/validateForm";
import {
	CREATE_KNOWLEDGEBASE_SCHEMA_KEY,
	EDIT_KNOWLEDGEBASE_SCHEMA_KEY,
} from "@Utils/Form/validationSchemas";
import apiFetch from "@Utils/fetch";

export async function getKnowledgeBases() {
	const request = await apiFetch("/api/knowledgebases/", "GET", undefined, true);
	return await request.json();
}

export async function getKnowledgeBase(id: string) {
	const request = await apiFetch(`/api/knowledgebases/${id}/`, "GET", undefined, true);
	return await request.json();
}

export async function createKnowledgeBase(prevState: object, formData: FormData) {
	const [isValid, errors] = await validateForm(formData, CREATE_KNOWLEDGEBASE_SCHEMA_KEY);
	if (!isValid) return { errors };

	const request = await apiFetch("/api/knowledgebases/", "POST", formData, true, undefined, true);
	if (request.status !== 201) return { errors: { form: "An error occurred, please try again" } };

	revalidatePath("/dashboard/knowledgebases");
	return { success: "Successfully created knowledge base" };
}

export async function updateKnowledgeBase(
	{ id }: { id: string },
	prevState: object,
	formData: FormData
) {
	const [isValid, errors] = await validateForm(formData, EDIT_KNOWLEDGEBASE_SCHEMA_KEY);
	if (!isValid) return { errors };

	if (
		(formData.get("type") as string).split("/")[0] === "file" &&
		(formData.get("file") as File).name === "undefined"
	)
		formData.delete("file");

	const request = await apiFetch(
		`/api/knowledgebases/${id}/`,
		"PUT",
		formData,
		true,
		undefined,
		true
	);
	if (request.status !== 200) return { errors: { form: "An error occurred, please try again" } };

	revalidatePath("/dashboard/knowledgebases");
	return { success: "Successfully updated knowledge base" };
}

export async function deleteKnowledgeBase(id: string) {
	await apiFetch(`/api/knowledgebases/${id}/`, "DELETE", undefined, true);
	revalidatePath("/dashboard/knowledgebases");
}

export async function getKnowledgeBaseTypes() {
	const request = await apiFetch(`/api/knowledgebases/types/`, "GET");
	return await request.json();
}

export async function revalidateKnowledgeBases() {
	revalidatePath("/dashboard/knowledgebases");
}
