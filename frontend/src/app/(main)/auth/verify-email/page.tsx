"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { XCircle, CheckCircle2 } from "lucide-react";
import Card from "@General/Card";
import Center from "@General/Center";
import { verifyEmail } from "@Utils/Auth";

export default function Page() {
	const [pending, setPending] = useState(true);
	const [state, setState] = useState(false);
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get("token") && searchParams.get("id")) {
			(async () => {
				const newState = await verifyEmail(
					searchParams.get("token") as string,
					searchParams.get("id") as string
				);
				setState(newState);
				setPending(false);
			})();
		} else {
			setPending(false);
			setState(false);
		}
	}, [searchParams]);

	return state && !pending ? (
		<Card className="bg-success-50 text-success-400">
			<div className="p-6 flex flex-col gap-4 justify-center items-center">
				<CheckCircle2 width={32} height={32} />
				<h1 className="text-2xl font-semibold">Email verified successfully</h1>
			</div>
		</Card>
	) : pending ? (
		<Center>
			<Spinner size="lg" />
		</Center>
	) : (
		<Card className="bg-danger-50 text-danger-400">
			<div className="p-6 flex flex-col gap-4 justify-center items-center">
				<XCircle width={32} height={32} />
				<h1 className="text-2xl font-semibold">Oops! Something went wrong</h1>
			</div>
		</Card>
	);
}
