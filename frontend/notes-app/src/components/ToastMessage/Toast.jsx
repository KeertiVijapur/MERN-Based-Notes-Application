import React, { useEffect } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div
      className={`absolute top-20 right-6 transition-all duration-300 ${
        isShown ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      <div 
        className={`relative min-w-52 bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full after:absolute after:left-0 after:top-0 after:rounded-l-lg ${
          type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
        }`}
      >
        <div className="flex items-center gap-3 py-2 px-4">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
            type === "delete" ? "bg-red-500" : "bg-green-500"
          }`}>
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-white" />
            ) : (
              <LuCheck className="text-xl text-white" />
            )}
          </div>

          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
