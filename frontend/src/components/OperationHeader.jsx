import { useState } from "react";
import OperationModal from "./OperationModal";

export default function OperationsHeader({ onOperationCreated }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Operations</h1>
          <p className="text-base text-teal-600 mt-1">
            Track every cent in and out of your account.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-800 hover:bg-teal-700 active:bg-teal-900 text-white text-base font-semibold px-7 py-3.5 rounded-lg transition-colors duration-150"
        >
          <span className="text-xl leading-none">+</span>
          New Operation
        </button>
      </div>

      {showModal && (
        <OperationModal
          onClose={() => setShowModal(false)}
          onCreated={(newOp) => {
            onOperationCreated?.(newOp);
            ;
          }}
        />
      )}
    </>
  );
}