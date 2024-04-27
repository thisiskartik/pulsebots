"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import FormGroup from "@Form/FormGroup";
import Input from "@Form/Input";
import { Plus } from "lucide-react";
import type { StartPrompt } from "@ChatBots/interfaces";

export default function StartPromptsForm({
	start_prompts,
}: {
	start_prompts?: Array<StartPrompt>;
}) {
	const [count, setCount] = useState(
		start_prompts && start_prompts.length > 0 ? start_prompts.length : 1
	);

	return (
		<FormGroup className="flex flex-col gap-4">
			{[...Array(count)].map((e, i) => (
				<Input
					key={`startprompts_${i}`}
					name={`startprompts`}
					defaultValue={
						start_prompts && start_prompts[i] ? start_prompts[i].message : undefined
					}
					label={i === 0 ? "Prompt suggestions" : undefined}
					placeholder={`Enter prompt suggestion ${i + 1}`}
					labelPlacement="outside"
				/>
			))}
			{count < 3 && (
				<Button
					className="w-fit"
					variant="flat"
					onClick={() => setCount(prevCount => prevCount + 1)}
				>
					Add more
					<Plus />
				</Button>
			)}
		</FormGroup>
	);
}
