import Card from "@Form/Card";
import KnowledgeBaseForm from "@KnowledgeBases/KnowledgeBaseForm";
import { getKnowledgeBase, getKnowledgeBaseTypes } from "@Utils/API/knowledgebases";

export default async function EditKnowledgeBasePage({ params }: { params: { id: string } }) {
	const [knoknowledgebase, knowledgeBaseTypes] = await Promise.all([
		getKnowledgeBase(params.id),
		getKnowledgeBaseTypes(),
	]);

	return (
		<Card backPath="/dashboard/knowledgebases" heading="Edit Knowledge Base">
			<KnowledgeBaseForm
				knowledgeBaseTypes={knowledgeBaseTypes}
				knowledgebase={knoknowledgebase}
			/>
		</Card>
	);
}
