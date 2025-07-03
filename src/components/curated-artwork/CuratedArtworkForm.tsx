import React, { useReducer } from "react";
import { CustomInput } from "../common/CustomInput";
import { DropdownMenu } from "../modal/DropdownMenu";
import { FormState, getEmptyFormState } from "./states";
import { _CuratedContentType } from "./type";

interface CuratedArtworkFormProps {
	addCuratedArtwork: (formState: FormState) => void;
}

const contentOptions = [
	{ label: "GIF", value: "GIF" as _CuratedContentType },
	{ label: "MP4", value: "MP4" as _CuratedContentType },
	{ label: "Nothing", value: "NOTHING" as _CuratedContentType },
];

type FormAction = {
	type: keyof FormState;
	value: string | [string, number, number] | _CuratedContentType | "";
};

function formReducer(state: FormState, action: FormAction): FormState {
	return { ...state, [action.type]: action.value };
}

export const CuratedArtworkForm = ({ addCuratedArtwork }: CuratedArtworkFormProps) => {
	const [state, dispatch] = useReducer(formReducer, getEmptyFormState());

	const setState = () => {
		dispatch({ type: "cldId", value: "" });
		dispatch({ type: "operatorDescription", value: "" });
		dispatch({ type: "artistName", value: "" });
		dispatch({ type: "imageUrl", value: "" });
		dispatch({ type: "type", value: "" });
		dispatch({ type: "id", value: "" });
	};

	const handleChange =
		(type: keyof FormState) =>
		(value: string | [string, number, number] | _CuratedContentType) => {
			dispatch({ type, value });
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const { cldId, operatorDescription, type } = state;
		if (!cldId || !operatorDescription || !type) {
			alert("filled!!");
			return;
		}
		setState();

		addCuratedArtwork({
			...state,
			type: type || "NOTHING",
		});
	};

	const inputs = [
		{
			label: "Painting Title",
			value: state.id,
			onChange: handleChange("id"),
			placeholder: "Painting title",
		},
		{
			label: "Artist Name",
			value: state.artistName,
			onChange: handleChange("artistName"),
			placeholder: "Artist Name",
		},
		{
			label: "Image URL",
			value: state.imageUrl,
			onChange: handleChange("imageUrl"),
			placeholder: "Image URL",
		},
		{
			label: "Cloudinary ID",
			value: state.cldId,
			onChange: handleChange("cldId"),
			placeholder: "cld ID",
		},
	];

	return (
		<form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
			<h2 className="mb-4 text-xl font-bold text-gray-700">Create new CuratedArtwork</h2>
			{inputs.map((input, index) => (
				<CustomInput
					key={index}
					label={input.label}
					value={input.value}
					onChange={input.onChange}
					placeholder={input.placeholder}
					required
				/>
			))}
			<CustomInput
				label="Operator Description"
				type="textarea"
				value={state.operatorDescription}
				onChange={handleChange("operatorDescription")}
				placeholder="Operator Description"
				required
			/>
			<DropdownMenu
				label="Content Type"
				options={contentOptions}
				value={state.type}
				onChange={handleChange("type")}
				placeholder="Select a content type"
				required
			/>

			<button
				type="submit"
				className="rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
			>
				Add CuratedArtwork
			</button>
		</form>
	);
};
