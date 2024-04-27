export interface KnowledgeBaseType {
	value: string;
	label: string;
}

export interface KnowledgeBase {
	id: string;
	name: string;
	vectorized_status: "loading" | "success" | "failed";
	embedding_count: number;
}
