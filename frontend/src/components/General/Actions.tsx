"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Tooltip,
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@nextui-org/react";
import { Trash2, Pencil } from "lucide-react";

export default function Actions({
	deleteFunction,
	objectToDelete,
	objectNameToDelete,
	editPath,
}: {
	editPath: string;
	deleteFunction: () => Promise<void>;
	objectToDelete: string;
	objectNameToDelete: string;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isLoading, setLoading] = useState(false);

	return (
		<>
			<div className="flex gap-2 justify-center">
				<Tooltip content="Delete">
					<Button isIconOnly className="text-danger-400" variant="light" onPress={onOpen}>
						<Trash2 />
					</Button>
				</Tooltip>
				<Tooltip content="Edit">
					<Button
						as={Link}
						href={editPath}
						isIconOnly
						className="text-green-400"
						variant="light"
					>
						<Pencil />
					</Button>
				</Tooltip>
			</div>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader>Delete {objectToDelete}</ModalHeader>
							<ModalBody>
								<p>
									Are you sure you want to delete &quot;{objectNameToDelete}
									&quot;?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="default" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="danger"
									onPress={async () => {
										setLoading(true);
										await deleteFunction();
										setLoading(false);
										onClose();
									}}
									isLoading={isLoading}
									disabled={isLoading}
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
