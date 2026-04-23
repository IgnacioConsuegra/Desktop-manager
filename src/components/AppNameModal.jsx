import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AppNameModal = ({ isOpen, onClose, onSave, initialValue }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialValue || "");
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-gradient-to-br from-[#2b0a1d] to-[#1e0814] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white uppercase tracking-widest">
            Add Application
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
              Display Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && name.trim() && onSave(name)}
              placeholder="Enter app name..."
              className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-orange-500/50 transition-all text-sm shadow-inner"
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-sm font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onSave(name)}
            className="bg-orange-600 cursor-pointer hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-600 text-white px-8 py-2 rounded-full font-bold transition-all shadow-lg border border-white/10 active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppNameModal;
