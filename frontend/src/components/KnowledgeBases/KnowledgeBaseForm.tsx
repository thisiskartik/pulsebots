"use client";

import { useRouter } from "next/navigation";
import Form from "@Form/Form";
import Input from "@Form/Input";
import Select from "@Form/Select";
import Submit from "@Form/Submit";
import {
	CREATE_KNOWLEDGEBASE_SCHEMA_KEY,
	EDIT_KNOWLEDGEBASE_SCHEMA_KEY,
} from "@Utils/Form/validationSchemas";
import { updateKnowledgeBase, createKnowledgeBase } from "@Utils/API/knowledgebases";
import KnowledgeBaseField from "@KnowledgeBases/KnowledgeBaseField";
import type { KnowledgeBase, KnowledgeBaseType } from "@KnowledgeBases/interfaces";

export default function KnowledgeBaseForm({
	knowledgeBaseTypes,
	knowledgebase = {},
}: {
	knowledgeBaseTypes: Array<KnowledgeBaseType>;
	knowledgebase?: {} | KnowledgeBase;
}) {
	const router = useRouter();

	return (
		<Form
			action={
				"id" in knowledgebase
					? updateKnowledgeBase.bind(null, { id: knowledgebase.id })
					: createKnowledgeBase
			}
			initialState={knowledgebase}
			validationSchema={
				"id" in knowledgebase
					? EDIT_KNOWLEDGEBASE_SCHEMA_KEY
					: CREATE_KNOWLEDGEBASE_SCHEMA_KEY
			}
			onSuccess={() => router.push("/dashboard/knowledgebases")}
			className="flex flex-col gap-4"
		>
			<Input
				name="name"
				label="Name"
				placeholder="Enter knowledge base name"
				isRequired
				labelPlacement="outside"
			/>
			<Select
				name="type"
				label="Type"
				placeholder="Select knowledge base type"
				options={knowledgeBaseTypes}
				isRequired
				labelPlacement="outside"
			/>
			<KnowledgeBaseField />
			<Submit>{"id" in knowledgebase ? "Update" : "Create"}</Submit>
		</Form>
	);
}
