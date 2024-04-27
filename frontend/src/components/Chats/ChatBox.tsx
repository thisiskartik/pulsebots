"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Divider, Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import Form from "@Form/Form";
import Input from "@Form/Input";
import Submit from "@Form/Submit";
import { INVOKE_CHAT_SCHEMA_KEY } from "@Utils/Form/validationSchemas";
import { getChat, invokeChat } from "@Utils/API/chats";
import { SendHorizonal } from "lucide-react";
import Messages from "@Chats/Messages";
import type { Message } from "@Chats/interface";

export default function ChatBox({
	chat,
	chatbot_name,
	chatbot_icon,
}: {
	chat: string;
	chatbot_name: string;
	chatbot_icon: string;
}) {
	const [messages, setMessages] = useState<Array<Message>>([]);
	const [key, setKey] = useState(Math.floor(Math.random() * 1_000_000).toString());
	const [customLoading, setCustomLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		(async () => {
			const currentChat = await getChat(chat);
			setMessages(
				currentChat.messages.filter((message: Message) => message.message_type !== "system")
			);
			inputRef.current?.focus();
		})();
	}, [chat]);

	const createMessage = useCallback(
		(id: string, message: string, message_type: "ai" | "human") =>
			setMessages(prevMessages => [
				...prevMessages,
				{
					id,
					message,
					message_type,
				},
			]),
		[]
	);

	const onSubmit = useCallback(() => {
		setCustomLoading(true);
		createMessage(
			Math.floor(Math.random() * 1_000_000).toString(),
			inputRef.current?.value ?? "",
			"human"
		);
		if (formRef.current) formRef.current.reset();
	}, [createMessage]);

	const onSuccess = useCallback(
		(state: any) => {
			const newMessageId = Math.floor(Math.random() * 1_000_000).toString();
			const stateRecursive = (nextStream: any) => {
				setMessages(prevMessages => {
					prevMessages = prevMessages.filter(message => message.id !== newMessageId);
					return [
						...prevMessages,
						{
							id: newMessageId,
							message: nextStream.content,
							message_type: "ai",
						},
					];
				});
				if (nextStream.next) nextStream.next.then(stateRecursive);
				else {
					setKey(Math.floor(Math.random() * 1_000_000).toString());
					setCustomLoading(false);
				}
			};
			createMessage(newMessageId, state.content, "ai");
			state.next.then(stateRecursive);
		},
		[createMessage]
	);

	if (messages) {
		return (
			<Card className="mb-4 bg-primary text-foreground w-64 sm:w-96 rounded-large h-96 shadow-xl">
				<CardHeader className="p-4 text-background font-medium shadow-md flex gap-2">
					<Image
						src={chatbot_icon}
						alt={chatbot_name}
						width={32}
						height={32}
						className="rounded-full"
					/>
					<h1>{chatbot_name}</h1>
				</CardHeader>
				<Divider />
				<CardBody className="p-4 bg-white">
					<Messages messages={messages} />
				</CardBody>
				<Divider className="bg-default" />
				<CardFooter className="p-4 shrink-0 bg-white">
					<Form
						ref={formRef}
						key={key}
						action={invokeChat.bind(null, { chat_id: chat })}
						initialState={{ message: "" }}
						validationSchema={INVOKE_CHAT_SCHEMA_KEY}
						className="w-full flex gap-1 items-center"
						onSuccess={onSuccess}
						onSubmit={onSubmit}
					>
						<Input
							ref={inputRef}
							radius="full"
							name="message"
							placeholder="Message"
							classNames={{ inputWrapper: "shadow-md" }}
							autoComplete="off"
							size="sm"
							hideError={true}
						/>
						<Submit
							isIconOnly
							radius="full"
							className="min-w-unit-12 w-unit-12 min-h-unit-12 h-unit-12 flex-1 shadow-md"
							color="primary"
							customLoading={customLoading}
						>
							<SendHorizonal />
						</Submit>
					</Form>
				</CardFooter>
			</Card>
		);
	}
}
