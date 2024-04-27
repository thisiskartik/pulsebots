"use client";

import { useState } from "react";
import ChatButton from "@Chats/ChatButton";
import ChatBox from "@Chats/ChatBox";
import { createChat } from "@Utils/API/chats";
import type { ChatBot } from "@ChatBots/interfaces";

export default function ChatUI({ chatbot }: { chatbot: ChatBot }) {
	const [chat, setChat] = useState();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col">
			{isOpen && chat && (
				<ChatBox chat={chat} chatbot_name={chatbot.name} chatbot_icon={chatbot.icon} />
			)}
			<ChatButton
				greeting_message={chatbot.greeting_message}
				icon={chatbot.icon}
				name={chatbot.name}
				isChatDefined={chat ? true : false}
				onClick={async () => {
					if (!chat) {
						const newChat = await createChat(chatbot.id);
						setChat(newChat.id);
						setIsOpen(true);
					} else setIsOpen(openStatus => !openStatus);
				}}
			/>
		</div>
	);
}
