import { AlertCircle } from "lucide-react";

export default function Error({ error }: { error?: string }) {
	if (error)
		return (
			<div className="flex bg-danger-50 p-4 rounded-medium text-danger-400 gap-2">
				<AlertCircle />
				<p className="font-medium ">{error}</p>
			</div>
		);
}
