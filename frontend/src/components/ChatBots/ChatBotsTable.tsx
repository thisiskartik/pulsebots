"use client";

import Image from "next/image";
import { useCallback } from "react";
import type { Key } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";
import Actions from "@General/Actions";
import { deleteChatBot } from "@Utils/API/chatbots";
import type { ChatBot } from "@ChatBots/interfaces";
import type { KnowledgeBase } from "@KnowledgeBases/interfaces";

const columns = [
	{
		key: "chatbot",
		label: "Chatbot",
	},
	{
		key: "knowledgeBases",
		label: "Knowledge Bases",
	},
	{
		key: "actions",
		label: "Actions",
	},
];

export default function ChatBotsTable({
	chatbots,
	knowledgeBases,
}: {
	chatbots: Array<ChatBot>;
	knowledgeBases: Array<KnowledgeBase>;
}) {
	const renderCell = useCallback(
		(chatbot: ChatBot, columnKey: Key) => {
			switch (columnKey) {
				case "chatbot":
					return (
						<div className="flex gap-4 items-center">
							<Image
								src={chatbot.icon}
								alt={chatbot.name}
								width={64}
								height={64}
								className="rounded-full"
							/>
							<div className="flex flex-col">
								<p className="font-bold text-">{chatbot.name}</p>
								<p className="text-default-400">
									{chatbot.description.length > 50
										? `${chatbot.description.substring(0, 50)}...`
										: chatbot.description}
								</p>
							</div>
						</div>
					);
				case "knowledgeBases":
					return chatbot.knowledgebases
						.map(
							(knowledgeBaseId: string) =>
								knowledgeBases.find(
									(knowledgeBase: KnowledgeBase) =>
										knowledgeBase.id === knowledgeBaseId
								)?.name
						)
						.join(", ");
				case "actions": {
					return (
						<Actions
							editPath={`/dashboard/chatbots/${chatbot.id}/edit`}
							deleteFunction={() => deleteChatBot(chatbot.id)}
							objectToDelete="Chatbot"
							objectNameToDelete={chatbot.name}
						/>
					);
				}
			}
		},
		[knowledgeBases]
	);

	return (
		<Table aria-label="List of chatbots" isStriped={true}>
			<TableHeader columns={columns}>
				{({ key, label }) => (
					<TableColumn
						key={key}
						className={key === "actions" ? "text-center" : undefined}
					>
						{label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				emptyContent={"There are no chatbots yet, try creating a new chatbot."}
				items={chatbots}
			>
				{item => (
					<TableRow key={item.id}>
						{columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
