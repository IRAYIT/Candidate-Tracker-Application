import { createPortal } from "react-dom";

export default function Modal({ children }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        {children}
      </div>
    </div>,
    document.body
  );
}