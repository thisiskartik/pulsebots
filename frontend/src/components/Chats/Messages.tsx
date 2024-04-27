import { useEffect, useRef, useCallback } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import showdown from "showdown";
import type { Message } from "@Chats/interface";

export default function Messages({ messages }: { messages: Array<Message> }) {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages]);

	const parseMessage = useCallback((content: string) => {
		const converter = new showdown.Converter();
		// TOOD: Add highlighting using highlight.js
		content = converter.makeHtml(content);
		return content;
	}, []);

	return (
		<>
			<Listbox
				items={messages}
				classNames={{ list: "gap-3" }}
				aria-label="Messages"
				emptyContent=""
			>
				{message => (
					<ListboxItem
						key={message.id}
						className={`w-fit bg-default rounded-medium hover:cursor-auto ${
							message.message_type === "human" && "self-end"
						}
						${
							message.message_type === "ai" &&
							"!bg-primary !hover:bg-primary !hover:text-background !text-background"
						}
						max-w-[75%]
					`}
						classNames={{
							title: `!overflow-auto whitespace-normal`,
						}}
						aria-label={`${message.message_type} Message`}
					>
						{message.message_type === "ai" ? (
							<div
								dangerouslySetInnerHTML={{
									__html: parseMessage(message.message),
								}}
								className="flex flex-col gap-2 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_pre]:overflow-auto [&_pre]:bg-zinc-800 [&_code]:bg-zinc-800 [&_code]:p-1 [&_code]:rounded-sm [&_code]:inline-block [&_pre]:p-3 [&_pre]:rounded-lg [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1 [&_ol]:list-decimal [&_ol]:ps-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_ul]:list-disc [&_ul]:ps-4"
							/>
						) : (
							<div>{message.message_type === "human" ? message.message : ""}</div>
						)}
					</ListboxItem>
				)}
			</Listbox>
			<div ref={scrollRef} />
		</>
	);
}
