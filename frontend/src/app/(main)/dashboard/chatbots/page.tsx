import Link from "next/link";
import { Button } from "@nextui-org/react";
import { getChatBots } from "@Utils/API/chatbots";
import { getKnowledgeBases } from "@Utils/API/knowledgebases";
import ChatBotsTable from "@ChatBots/ChatBotsTable";

export default async function ChatbotsPage() {
	const [chatbots, knowledgeBases] = await Promise.all([getChatBots(), getKnowledgeBases()]);

	return (
		<div className="flex flex-col gap-4">
			<div className="self-end">
				<Button as={Link} href="/dashboard/chatbots/create" variant="solid" color="primary">
					Create Chatbot
				</Button>
			</div>
			<ChatBotsTable chatbots={chatbots} knowledgeBases={knowledgeBases} />
		</div>
	);
}
