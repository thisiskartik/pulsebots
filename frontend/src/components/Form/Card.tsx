import Link from "next/link";
import { Button } from "@nextui-org/react";
import GeneralCard from "@General/Card";
import { ArrowLeft } from "lucide-react";

export default function Card({
	children,
	backPath,
	heading,
}: {
	children: React.ReactNode;
	backPath: string;
	heading: string;
}) {
	return (
		<div className="flex justify-center">
			<div className="w-full flex flex-col gap-6">
				<GeneralCard
					headerPosition="start"
					maxWidth="none"
					header={
						<h2 className="text-2xl font-medium flex gap-2 items-center">
							<Button
								as={Link}
								href={backPath}
								variant="light"
								isIconOnly
								radius="full"
							>
								<ArrowLeft className="h-full" />
							</Button>
							{heading}
						</h2>
					}
				>
					{children}
				</GeneralCard>
			</div>
		</div>
	);
}
