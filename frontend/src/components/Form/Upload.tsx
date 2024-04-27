"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload as UploadIcon, File } from "lucide-react";
import useFieldError from "@Utils/Form/useFieldError";
import type { FieldProps } from "@Form/Form";

interface UploadProps extends FieldProps, React.HTMLAttributes<HTMLInputElement> {
	type: "icon" | "file";
	icon?: React.ReactNode;
	accept: string;
}

export default function Upload({
	name,
	accept,
	type,
	icon,
	label,
	state,
	validationSchema,
	values,
	setValues,
	...props
}: UploadProps) {
	const { inputFieldProps, error } = useFieldError(
		name,
		state,
		values,
		setValues,
		validationSchema
	);
	const [uploadedFile, setUploadedFile] = useState<
		string | ArrayBuffer | File | null | undefined
	>(name && values && values[name]);
	const [filename, setFilename] = useState<undefined | string>(
		name && values && values[name] ? values[name].split("/").at(-1) : undefined
	);

	useEffect(() => {
		if (!uploadedFile) setFilename(undefined);
	}, [uploadedFile, filename]);

	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={name} className="rounded-full flex justify-center w-full">
				{type === "icon" &&
					(uploadedFile ? (
						<Image
							src={uploadedFile as string}
							alt="Chatbhot icon"
							width={128}
							height={128}
							className="cursor-pointer w-32 h-32 rounded-full"
						/>
					) : (
						<div className="cursor-pointer w-32 h-32 p-6 bg-content2 rounded-full">
							{icon}
						</div>
					))}
				{type === "file" && (
					<div className="cursor-pointer py-12 px-6 w-full bg-content2 rounded-lg flex flex-col gap-4 justify-center items-center border-4 border-primary-500 text-primary-500 border-dashed">
						{uploadedFile ? (
							<>
								<File width={42} height={42} />
								<p className="text-center font-bold text-xl">{filename}</p>
							</>
						) : (
							<>
								<UploadIcon width={42} height={42} />
								<p className="text-center font-bold text-xl ">Upload File</p>
							</>
						)}
					</div>
				)}
			</label>

			<input
				className="hidden"
				type="file"
				id={name}
				name={name}
				accept={accept}
				onChange={e => {
					if (inputFieldProps?.onChange) inputFieldProps?.onChange(e);
					if (e.target.files) {
						const fileReader = new FileReader();
						fileReader.onload = readerEvent => {
							if (e.target?.files) setFilename(e.target?.files[0].name);
							setUploadedFile(readerEvent.target?.result);
						};
						fileReader.readAsDataURL(e.target.files[0]);
					}
				}}
				{...props}
			/>
			{error && <p>{error}</p>}
		</div>
	);
}
