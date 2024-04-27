"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Progress } from "@nextui-org/react";
import { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

export default function Alert({
	showCondition,
	setShowCondition,
	message,
	Icon,
	color,
	onClose,
	time = 5,
}: {
	showCondition: boolean;
	setShowCondition: React.Dispatch<React.SetStateAction<boolean>>;
	Icon: LucideIcon;
	color: "success" | "danger";
	message: string;
	onClose?: () => void;
	time?: number;
}) {
	const [progress, setProgress] = useState(time * 100);
	const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (showCondition) {
			const interval = setInterval(() => {
				setProgress(progress => progress - 1);
			}, 1);
			setIntervalRef(interval);

			return () => clearInterval(interval);
		}
	}, [showCondition]);

	useEffect(() => {
		if (progress <= 0 && intervalRef) {
			clearInterval(intervalRef);
			setShowCondition(false);
			setProgress(time * 100);
			if (onClose) onClose();
		}
	}, [progress, intervalRef, setShowCondition, onClose, time]);

	return (
		<AnimatePresence>
			{showCondition && (
				<motion.div
					initial={{ y: -80, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -80, opacity: 0 }}
					transition={{ type: "spring", duration: 0.8 }}
					className="fixed left-0 right-0 top-20 flex justify-center z-50"
				>
					<div
						className={`relative ${color === "success" && "bg-success-50"} ${
							color === "danger" && "bg-danger-50"
						} py-4 px-6 rounded-t-small text-success-400 max-w-sm flex justify-between gap-8`}
					>
						<div className="flex gap-2">
							<Icon className="flex-shrink-0" />
							<span className="-mt-1">{message}</span>
						</div>
						<Button
							variant="light"
							isIconOnly
							className={`${color === "success" && "text-success-400"} ${
								color === "danger" && "text-danger-400"
							}`}
							radius="full"
							size="sm"
							onClick={() => {
								setShowCondition(false);
								if (intervalRef) clearInterval(intervalRef);
								setIntervalRef(null);
								setProgress(time * 100);
								if (onClose) onClose();
							}}
						>
							<X />
						</Button>
						<Progress
							size="sm"
							color={color}
							aria-label="Loading..."
							disableAnimation
							value={progress / time}
							className="absolute bottom-0 left-0"
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
