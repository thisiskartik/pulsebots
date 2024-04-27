import Card from "@Form/Card";
import ChatBotForm from "@ChatBots/ChatBotForm";
import { getKnowledgeBases } from "@Utils/API/knowledgebases";

export default async function ChatBotCreatePage() {
	const knowledgeBases = await getKnowledgeBases();

	return (
		<Card backPath="/dashboard/chatbots" heading="Create ChatBot">
			<ChatBotForm knowledgeBases={knowledgeBases} />
		</Card>
	);
}
