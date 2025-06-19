import { useState } from "react";
import { useRecoilState } from "recoil";
import { FormState } from "./states";
import { formStateAtom } from "./atom";
import { HoverImagePreview } from "../common/HoverImagePreview";

interface CuratedArtworkCardProps {
	formState: FormState;
	index: number;
}

export const CuratedArtworkCard = ({
	formState: curatedArtwork,
	index,
}: CuratedArtworkCardProps) => {
	const [editableFormState, setEditableArtwork] = useState(curatedArtwork);
	const [curatedArtworks, setCuratedArtworks] = useRecoilState(formStateAtom);
	const [isEditing, setIsEditing] = useState(false);

	const handleInputChange =
		(field: keyof typeof editableFormState) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setEditableArtwork({ ...editableFormState, [field]: e.target.value });
		};
	const handleSave = () => {
		const updatedArtworks = [...curatedArtworks];
		updatedArtworks[index] = editableFormState; // 해당 인덱스의 항목 수정
		setCuratedArtworks(updatedArtworks); // Recoil 상태 업데이트
		setIsEditing(false); // 편집 모드 종료
	};

	const renderInputFields = () => {
		const fields = [
			{
				label: "Cloudinary ID",
				value: editableFormState.cldId,
				field: "cldId" as keyof typeof editableFormState,
			},
			{
				label: "Image URL",
				value: editableFormState.imageUrl,
				field: "imageUrl" as keyof typeof editableFormState,
			},
			{
				label: "Artist Name",
				value: editableFormState.artistName,
				field: "artistName" as keyof typeof editableFormState,
			},
		];

		return fields.map(({ label, value, field }, index) => (
			<div key={`${field}+${index}`} className="edit-input">
				<label className="mb-2 block text-gray-600">{label}</label>
				<input
					type="text"
					value={value}
					onChange={handleInputChange(field)}
					className="w-full rounded-md border p-1 text-blue-500"
					placeholder={label}
				/>
			</div>
		));
	};

	return (
		<li className="rounded-lg bg-gray-100 p-4 shadow-sm">
			<div className="flex items-start justify-between py-2">
				{isEditing ? (
					<input
						type="text"
						value={editableFormState.id}
						onChange={handleInputChange("id")}
						className="mb-3 w-full rounded-md border p-1 text-xl font-extrabold text-gray-800"
						placeholder="ID"
					/>
				) : (
					<h3 className="line-clamp-3 text-lg font-semibold text-gray-800">
						{curatedArtwork.id}
					</h3>
				)}
				<button
					className="rounded-lg py-1 pl-12 pr-2 font-mono text-sm text-black hover:underline"
					onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
				>
					{isEditing ? "Save" : "Edit"}
				</button>
			</div>
			{isEditing ? (
				<>
					{renderInputFields()}
					<textarea
						value={editableFormState.operatorDescription}
						onChange={handleInputChange("operatorDescription")}
						className="mt-2 h-80 w-full rounded-md border p-1 text-gray-600"
						placeholder="Operator Description"
					/>
				</>
			) : (
				<>
					<p className="mt-2 truncate text-blue-500">cld_Id: {curatedArtwork.cldId}</p>
					<HoverImagePreview url={curatedArtwork.imageUrl}></HoverImagePreview>
					<p className="mt-2 text-gray-700">
						operatorDescription: {curatedArtwork.operatorDescription}
					</p>
				</>
			)}
			<p className="mt-4 text-sm text-gray-500">content type: {curatedArtwork.type}</p>
		</li>
	);
};
