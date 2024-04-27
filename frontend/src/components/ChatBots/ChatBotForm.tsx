"use client";

import { useRouter } from "next/navigation";
import Form from "@Form/Form";
import Input from "@Form/Input";
import Textarea from "@Form/Textarea";
import Upload from "@Form/Upload";
import Select from "@Form/Select";
import Submit from "@Form/Submit";
import FormGroup from "@Form/FormGroup";
import StartPromptsForm from "@ChatBots/StartPromptsForm";
import { CREATE_CHATBOT_SCHEMA_KEY, EDIT_CHATBOT_SCHEMA_KEY } from "@Utils/Form/validationSchemas";
import { createChatBot, updateChatBot } from "@Utils/API/chatbots";
import { Bot } from "lucide-react";
import type { ChatBot } from "@ChatBots/interfaces";

export default function ChatBotForm({
	knowledgeBases,
	chatbot = {},
}: {
	knowledgeBases: Array<{ name: string; id: string }>;
	chatbot?: {} | ({ knowledgebases: string } | ChatBot);
}) {
	const router = useRouter();
	if ("knowledgebases" in chatbot && typeof chatbot.knowledgebases !== "string")
		chatbot.knowledgebases = (chatbot.knowledgebases as Array<string>).join(",");

	return (
		<Form
			action={
				"id" in chatbot
					? updateChatBot.bind(null, {
							id: chatbot.id,
							start_prompts: chatbot.start_prompts,
					  })
					: createChatBot
			}
			initialState={chatbot}
			validationSchema={"id" in chatbot ? EDIT_CHATBOT_SCHEMA_KEY : CREATE_CHATBOT_SCHEMA_KEY}
			className="flex flex-col gap-8"
			onSuccess={() => router.push("/dashboard/chatbots")}
		>
			<FormGroup className="flex gap-8">
				<FormGroup className="flex flex-col gap-4 flex-1">
					<Upload
						name="icon"
						type="icon"
						label="Icon"
						accept="image/*"
						icon={<Bot className="w-full h-full" />}
					/>
					<Input
						name="name"
						label="Name"
						placeholder="Enter chatbot's name"
						isRequired
						labelPlacement="outside"
					/>
					<Textarea
						name="greeting_message"
						label="Greeting message"
						placeholder="Enter initial greeting message from your chatbot"
						isRequired
						labelPlacement="outside"
					/>
					<Textarea
						name="description"
						label="Description"
						placeholder="Enter description for your chatbot"
						isRequired
						labelPlacement="outside"
					/>
				</FormGroup>
				<FormGroup className="flex flex-col gap-6 flex-1">
					<StartPromptsForm
						start_prompts={
							"start_prompts" in chatbot ? chatbot.start_prompts : undefined
						}
					/>
					<Select
						name="knowledgebases"
						label="Knowledge base"
						placeholder="Select a knowledge base"
						selectionMode="multiple"
						labelPlacement="outside"
						isRequired
						options={knowledgeBases.map(
							(knowledgeBase: { name: string; id: string }) => ({
								label: knowledgeBase.name,
								value: knowledgeBase.id,
							})
						)}
					/>
					<Submit>{"id" in chatbot ? "Update" : "Create"}</Submit>
				</FormGroup>
			</FormGroup>
		</Form>
	);
}
