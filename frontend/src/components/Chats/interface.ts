export interface Message {
	id: string;
	message: string;
	message_type: "human" | "ai" | "system";
}
