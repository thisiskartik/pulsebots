export interface StartPrompt {
	id: string;
	message: string;
}

export interface ChatBot {
	id: string;
	name: string;
	icon: string;
	greeting_message: string;
	description: string;
	knowledgebases: Array<string>;
	start_prompts: Array<StartPrompt>;
}
