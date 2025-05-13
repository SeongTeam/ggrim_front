
'use client'

interface GuideModalProps {
    message : string;
    onClickNext : () => void;
}


const GuideModal = ({ message, onClickNext }:GuideModalProps) => {


    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white text-black p-6 rounded shadow-xl max-w-sm w-full">
          <p className="mb-4">{message}</p>
          <button onClick={onClickNext} className="px-4 py-2 bg-green-600 text-white rounded">
            Next
          </button>
        </div>
      </div>
    )
  }
  
export default GuideModal;