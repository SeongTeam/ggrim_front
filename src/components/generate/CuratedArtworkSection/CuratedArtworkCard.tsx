import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { FormState } from './states';
import { formStateAtom } from './atom';
import HoverImagePreview from '../../common/HoverImagePreview';

interface CuratedArtworkCardProps {
    formState: FormState;
    index: number;
}

export default function CuratedArtworkCard({
    formState: curatedArtwork,
    index,
}: CuratedArtworkCardProps) {
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
                label: 'Cloudinary ID',
                value: editableFormState.cldId,
                field: 'cldId' as keyof typeof editableFormState,
            },
            {
                label: 'Image URL',
                value: editableFormState.imageUrl,
                field: 'imageUrl' as keyof typeof editableFormState,
            },
            {
                label: 'Artist Name',
                value: editableFormState.artistName,
                field: 'artistName' as keyof typeof editableFormState,
            },
        ];

        return fields.map(({ label, value, field }, index) => (
            <div key={`${field}+${index}`} className="edit-input ">
                <label className="block text-gray-600 mb-2">{label}</label>
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange(field)}
                    className="text-blue-500 border  p-1 rounded-md w-full"
                    placeholder={label}
                />
            </div>
        ));
    };

    return (
        <li className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-start py-2 justify-between">
                {isEditing ? (
                    <input
                        type="text"
                        value={editableFormState.id}
                        onChange={handleInputChange('id')}
                        className="text-xl font-extrabold text-gray-800 border mb-3 p-1  w-full rounded-md"
                        placeholder="ID"
                    />
                ) : (
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-3">
                        {curatedArtwork.id}
                    </h3>
                )}
                <button
                    className="text-black font-mono py-1 pl-12 pr-2 rounded-lg hover:underline text-sm"
                    onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                >
                    {isEditing ? 'Save' : 'Edit'}
                </button>
            </div>
            {isEditing ? (
                <>
                    {renderInputFields()}
                    <textarea
                        value={editableFormState.operatorDescription}
                        onChange={handleInputChange('operatorDescription')}
                        className="text-gray-600 mt-2 border p-1 rounded-md h-80 w-full"
                        placeholder="Operator Description"
                    />
                </>
            ) : (
                <>
                    <p className="text-blue-500 mt-2 truncate">cld_Id: {curatedArtwork.cldId}</p>
                    <HoverImagePreview url={curatedArtwork.imageUrl}></HoverImagePreview>
                    <p className="text-gray-700 mt-2">
                        operatorDescription: {curatedArtwork.operatorDescription}
                    </p>
                </>
            )}
            <p className="text-sm text-gray-500 mt-4">content type: {curatedArtwork.type}</p>
        </li>
    );
}
