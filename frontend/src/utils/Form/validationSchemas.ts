import * as Yup from "yup";
import { getKnowledgeBaseTypes } from "@Utils/API/knowledgebases";
import type { KnowledgeBaseType } from "@KnowledgeBases/interfaces";

export const REGISTRATION_SCHEMA_KEY = "registrationSchema";
export const LOGIN_SCHEMA_KEY = "loginSchema";
export const RESET_PASSWORD_EMAIL_SCHEMA_KEY = "resetPasswordEmailSchema";
export const RESET_PASSWORD_SCHEMA_KEY = "resetPasswordSchema";
export const EDIT_CHATBOT_SCHEMA_KEY = "EditChatBotSchema";
export const CREATE_CHATBOT_SCHEMA_KEY = "CreateChatBotSchema";
export const EDIT_KNOWLEDGEBASE_SCHEMA_KEY = "EditKnowledgeBaseSchema";
export const CREATE_KNOWLEDGEBASE_SCHEMA_KEY = "CreateKnowledgeBaseSchema";
export const INVOKE_CHAT_SCHEMA_KEY = "InvokeChatSchema";

const validationSchemas: { [key: string]: Yup.Schema } = {
	[REGISTRATION_SCHEMA_KEY]: Yup.object().shape({
		first_name: Yup.string().required("Please enter your first name"),
		last_name: Yup.string().required("Please enter your last name"),
		email: Yup.string()
			.required("Please enter your email address")
			.email("Please enter a valid email address"),
		password: Yup.string()
			.required("Please enter your password")
			.min(8, "Password must be minium 8 characters")
			.matches(
				/^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z].*$/,
				"Password cannot be entirely numeric"
			),
	}),
	[LOGIN_SCHEMA_KEY]: Yup.object().shape({
		email: Yup.string()
			.required("Please enter your email address")
			.email("Please enter a valid email address"),
		password: Yup.string().required("Please enter your password"),
	}),
	[RESET_PASSWORD_EMAIL_SCHEMA_KEY]: Yup.object().shape({
		email: Yup.string()
			.required("Please enter your email address")
			.email("Please enter a valid email address"),
	}),
	[RESET_PASSWORD_SCHEMA_KEY]: Yup.object().shape({
		password: Yup.string()
			.required("Please enter your password")
			.min(8, "Password must be minium 8 characters")
			.matches(
				/^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z].*$/,
				"Password cannot be entirely numeric"
			),
		confirm_password: Yup.string()
			.required("Please re-enter your password")
			.test("passwords-match", "Passwords must match", function (value) {
				return this.parent.password === value;
			}),
	}),
	[EDIT_CHATBOT_SCHEMA_KEY]: Yup.object().shape({
		name: Yup.string().required("Please enter your chatbot's name"),
		greeting_message: Yup.string().required("Please enter greeting message"),
		description: Yup.string().required("Please enter required message"),
		knowledgebases: Yup.string().required("Please select atleast one knowledge base"),
	}),
	[EDIT_KNOWLEDGEBASE_SCHEMA_KEY]: Yup.object().shape({
		name: Yup.string().required("Please enter your knowledge base name"),
		type: Yup.string()
			.required("Please select type of knowledge base")
			.test("checkType", "Please select a valid knowledge base type", async value => {
				const types = (await getKnowledgeBaseTypes()).map(
					(type: KnowledgeBaseType) => type.value
				);
				return types.includes(value);
			}),
		content_url: Yup.string().when("type", (type, schema) => {
			if (type[0] && type[0].split("/")[0] === "content")
				return schema
					.required("Please enter Content's URL")
					.url("Please enter a valid URL");
			return schema;
		}),
	}),
	[INVOKE_CHAT_SCHEMA_KEY]: Yup.object().shape({
		message: Yup.string().required("Please enter a message"),
	}),
};
validationSchemas[CREATE_CHATBOT_SCHEMA_KEY] = validationSchemas[EDIT_CHATBOT_SCHEMA_KEY].concat(
	Yup.object({
		icon: Yup.mixed().required("Please upload chatbot icon"),
	})
);
validationSchemas[CREATE_KNOWLEDGEBASE_SCHEMA_KEY] = validationSchemas[
	EDIT_KNOWLEDGEBASE_SCHEMA_KEY
].concat(
	Yup.object({
		file: Yup.mixed().when("type", (type, schema) => {
			if (type[0] && type[0].split("/")[0] === "file")
				return schema.required("Please upload file");
			return schema;
		}),
	})
);

export default validationSchemas;
