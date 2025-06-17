
interface AlertModalProps {
    message : string;
    onClose : ()=>Promise<void>;
}

export const  AlertModal = ({ message , onClose } : AlertModalProps) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80">
          <h3 className="text-lg font-bold text-red-600">⚠ Error Occur</h3>
          <p className="mt-2">{message}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded"
          >
            Ok
          </button>
        </div>
      </div>
    );
  }