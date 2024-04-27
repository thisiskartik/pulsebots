import { Card as NextUICard, CardHeader, CardBody, Divider } from "@nextui-org/react";
import Center from "@General/Center";

export default function Card({
	header,
	headerPosition,
	maxWidth,
	className,
	children,
}: {
	header?: React.ReactNode;
	headerPosition?: string;
	maxWidth?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Center>
			<NextUICard
				className={`p-4 ${
					!maxWidth ? "max-w-md" : maxWidth === "none" ? undefined : maxWidth
				} w-full ${className}`}
			>
				{header && (
					<>
						<CardHeader
							className={`${
								headerPosition === "start" ? "justify-start" : "justify-center"
							} mt-4`}
						>
							{header}
						</CardHeader>
						<Divider className="my-4" />
					</>
				)}
				<CardBody className={header ? "mb-8" : undefined}>{children}</CardBody>
			</NextUICard>
		</Center>
	);
}
