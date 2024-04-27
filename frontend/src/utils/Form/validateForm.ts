import * as Yup from "yup";
import validationSchemas from "@Utils/Form/validationSchemas";

export function serializeFormData(formData: FormData) {
	const data: { [key: string]: any } = {};
	formData.forEach((val: FormDataEntryValue, key: string) => {
		let newVal;
		try {
			newVal = JSON.parse(val as string);
			newVal = typeof newVal === "object" ? newVal : JSON.parse(newVal);
		} catch (e) {
			newVal = val;
		}
		if (newVal) {
			if (key in data && typeof newVal === "string") {
				data[key] += `,${newVal}`;
			} else {
				data[key] = newVal;
			}
		}
	});
	return data;
}

export default async function validateForm(formData: FormData, validationSchema: string) {
	const schema = validationSchemas[validationSchema];
	const data = serializeFormData(formData);
	try {
		await schema.validate(data, { abortEarly: false });
		return [true, {}];
	} catch (err: any) {
		const errors: any = {};
		err?.inner?.forEach((e: any) => {
			errors[e.path as keyof any] = e.message;
		});
		return [false, errors];
	}
}

export async function validateField(
	validationSchema: string,
	name: string | undefined,
	values: { [name: string]: any },
	setError: React.Dispatch<React.SetStateAction<undefined | string>>
) {
	try {
		const schema = validationSchemas[validationSchema] as Yup.ObjectSchema<any>;
		if (name && name in schema.fields) {
			try {
				values[name] = JSON.parse(values[name] as string);
			} catch {
				values[name] = values[name];
			}
			await schema.validateAt(name, values);
		}
		setError(undefined);
	} catch (err: any) {
		setError(err.errors[0]);
	}
}
