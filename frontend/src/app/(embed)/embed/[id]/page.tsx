import { getChatBot } from "@Utils/API/chatbots";
import ChatUI from "@Chats/ChatUI";
import type { ChatBot } from "@ChatBots/interfaces";

export default async function ChatBotEmbedPage({ params }: { params: { id: string } }) {
	const chatbot: ChatBot = await getChatBot(params.id);

	return <ChatUI chatbot={chatbot} />;
}
