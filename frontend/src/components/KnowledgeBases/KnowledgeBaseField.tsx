"use client";

import { useState, useEffect, useMemo } from "react";
import Input from "@Form/Input";
import Upload from "@Form/Upload";

export default function KnowledgeBaseField({ ...props }) {
	const [fieldType, setFieldType] = useState<"file" | "content" | undefined>();

	useEffect(() => {
		if (!props.values?.type) return;

		props.setValues((vals: object) => ({
			...vals,
			content_url: undefined,
			file: undefined,
		}));
		setFieldType(props.values?.type.split("/")[0]);
	}, [props.values?.type, props.setValues]);

	const acceptType = useMemo(() => {
		if (!props.values?.type || props.values.type.split("/")[0] !== "file") return "";

		const fileType = props.values.type.split("/")[1];
		switch (fileType) {
			case "text":
				return ".txt";
			case "pdf":
				return ".pdf";
			case "docx":
				return ".doc,.docx";
			case "pptx":
				return ".ppt,.pptx";
			case "csv":
				return ".csv";
			case "markdown":
				return ".md";
			default:
				return "";
		}
	}, [props.values?.type]);

	if (fieldType === "file") {
		return <Upload name="file" type="file" accept={acceptType} {...props} />;
	} else if (fieldType === "content") {
		return (
			<Input
				name="content_url"
				label="Content URL"
				placeholder="Enter content's url"
				isRequired
				labelPlacement="outside"
				{...props}
			/>
		);
	}
}
