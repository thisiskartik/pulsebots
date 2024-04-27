import Card from "@Form/Card";
import KnowledgeBaseForm from "@KnowledgeBases/KnowledgeBaseForm";
import { getKnowledgeBaseTypes } from "@Utils/API/knowledgebases";

export default async function CreateKnowledgeBasePage() {
	const knowledgeBaseTypes = await getKnowledgeBaseTypes();

	return (
		<Card backPath="/dashboard/knowledgebases" heading="Create Knowledge Base">
			<KnowledgeBaseForm knowledgeBaseTypes={knowledgeBaseTypes} />
		</Card>
	);
}
