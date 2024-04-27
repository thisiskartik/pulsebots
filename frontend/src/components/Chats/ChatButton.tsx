"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Tooltip } from "@nextui-org/react";

export default function ChatButton({
	greeting_message,
	icon,
	name,
	isChatDefined,
	onClick,
}: {
	greeting_message: string;
	icon: string;
	name: string;
	isChatDefined: boolean;
	onClick: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsOpen(true);
		}, 2000);

		setTimeout(() => {
			setIsOpen(false);
		}, 8000);
	}, []);

	return (
		<Tooltip
			showArrow
			placement="top-end"
			content={greeting_message}
			isOpen={isChatDefined ? false : isOpen}
			onOpenChange={open => setIsOpen(open)}
			classNames={{
				base: ["before:bg-foreground"],
				content: ["py-2 px-4 shadow-xl text-md text-background bg-foreground"],
			}}
		>
			<Button
				radius="full"
				isIconOnly
				className="w-unit-14 h-unit-14 self-end shadow-xl"
				onPress={onClick}
			>
				<Image width={200} height={200} src={icon} alt={name} priority />
			</Button>
		</Tooltip>
	);
}
