'use client'
import React from "react";

interface ModalProps{
    onClose : ()=>void;
    children : React.ReactNode;
}

export const Modal = ({ onClose, children } : ModalProps) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <button
          className="mb-4 text-gray-600 hover:text-gray-900 font-bold"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
