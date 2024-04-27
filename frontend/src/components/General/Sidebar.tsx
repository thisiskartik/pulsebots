"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Link as NextUILink } from "@nextui-org/react";
import { Bot, BookText, Blocks } from "lucide-react";

export default function Sidebar() {
	const pathname = usePathname();
	const menuItems = useMemo(
		() => [
			{
				label: "Chatbots",
				path: "/dashboard/chatbots",
				activeCondition: /\/dashboard\/chatbots(.*)/.test(pathname),
				Icon: Bot,
			},
			{
				label: "Knowledge Base",
				path: "/dashboard/knowledgebases",
				activeCondition: /\/dashboard\/knowledgebases(.*)/.test(pathname),
				Icon: BookText,
			},
			{
				label: "Integration",
				path: "/dashboard/integration",
				activeCondition: /\/dashboard\/integration(.*)/.test(pathname),
				Icon: Blocks,
			},
		],
		[pathname]
	);

	return (
		<nav className="h-full">
			<ul>
				{menuItems.map(({ label, path, activeCondition, Icon }) => (
					<li key={label}>
						<NextUILink
							as={Link}
							href={path}
							className={`flex gap-2 w-full h-full px-6 py-4 font-medium ${
								activeCondition && " bg-primary "
							}`}
							color="foreground"
						>
							<Icon />
							{label}
						</NextUILink>
					</li>
				))}
			</ul>
		</nav>
	);
}
