"use client";

import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";
import { revalidateKnowledgeBases } from "@Utils/API/knowledgebases";

export default function LoadingState() {
	useEffect(() => {
		const revalidateInterval = setInterval(() => {
			(async () => {
				revalidateKnowledgeBases();
			})();
		}, 2000);
		return () => clearInterval(revalidateInterval);
	}, []);

	return <Spinner />;
}
