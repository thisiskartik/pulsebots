import Card from "@Form/Card";
import ChatBotForm from "@ChatBots/ChatBotForm";
import { getChatBot } from "@Utils/API/chatbots";
import { getKnowledgeBases } from "@Utils/API/knowledgebases";

export default async function ChatBotEditPage({ params }: { params: { id: string } }) {
	const [chatbot, knowledgeBases] = await Promise.all([
		getChatBot(params.id),
		getKnowledgeBases(),
	]);

	return (
		<Card backPath="/dashboard/chatbots" heading="Edit ChatBot">
			<ChatBotForm knowledgeBases={knowledgeBases} chatbot={chatbot} />
		</Card>
	);
}
