import Link from "next/link";
import { Button } from "@nextui-org/react";
import { getKnowledgeBases } from "@Utils/API/knowledgebases";
import KnowledgeBasesTable from "@KnowledgeBases/KnowledgeBasesTable";

export default async function KnowledgeBasesPage() {
	const knowledgeBases = await getKnowledgeBases();

	return (
		<div className="flex flex-col gap-4">
			<div className="self-end">
				<Button
					as={Link}
					href="/dashboard/knowledgebases/create"
					variant="solid"
					color="primary"
				>
					Create Knowledge Base
				</Button>
			</div>
			<KnowledgeBasesTable knowledgeBases={knowledgeBases} />
		</div>
	);
}
