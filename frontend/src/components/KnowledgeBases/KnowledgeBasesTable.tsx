"use client";

import { useCallback } from "react";
import type { Key } from "react";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	Spinner,
} from "@nextui-org/react";
import Actions from "@General/Actions";
import { deleteKnowledgeBase } from "@Utils/API/knowledgebases";
import { CheckCircle, XCircle } from "lucide-react";
import LoadingState from "@KnowledgeBases/LoadingState";
import type { KnowledgeBase } from "@KnowledgeBases/interfaces";

const columns = [
	{
		key: "knowledgebase",
		label: "Knowledge Base",
	},
	{
		key: "embedding_count",
		label: "Embedding count",
	},
	{
		key: "status",
		label: "Status",
	},
	{
		key: "actions",
		label: "Delete",
	},
];

export default function KnowledgeBasesTable({
	knowledgeBases,
}: {
	knowledgeBases: Array<KnowledgeBase>;
}) {
	const renderCell = useCallback((knowledgebase: KnowledgeBase, columnKey: Key) => {
		switch (columnKey) {
			case "knowledgebase":
				return knowledgebase.name;
			case "embedding_count":
				return knowledgebase.embedding_count;
			case "status":
				return (
					<div className="flex justify-center">
						{(() => {
							switch (knowledgebase.vectorized_status) {
								case "loading":
									return <LoadingState />;
								case "success":
									return <CheckCircle className="text-green-400 " />;
								case "failed":
									return <XCircle className="text-danger-400" />;
							}
						})()}
					</div>
				);
			case "actions": {
				return (
					<Actions
						editPath={`/dashboard/knowledgebases/${knowledgebase.id}/edit`}
						deleteFunction={() => deleteKnowledgeBase(knowledgebase.id)}
						objectToDelete="Knowledge Base"
						objectNameToDelete={knowledgebase.name}
					/>
				);
			}
		}
	}, []);

	return (
		<Table aria-label="List of knowledge bases" isStriped={true}>
			<TableHeader columns={columns}>
				{({ key, label }) => (
					<TableColumn
						key={key}
						className={
							["embedding_count", "actions", "status"].includes(key)
								? "text-center"
								: undefined
						}
					>
						{label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				emptyContent={"There is no knowledge base yet, try creating a new knowledge base."}
				items={knowledgeBases}
			>
				{item => (
					<TableRow key={item.id}>
						{columnKey => (
							<TableCell
								className={
									columnKey === "embedding_count" ? "text-center" : undefined
								}
							>
								{renderCell(item, columnKey)}
							</TableCell>
						)}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
