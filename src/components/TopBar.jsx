import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const TopBar = ({ onAddClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = date => {
    return (
      date.toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="h-8 w-full bg-black flex items-center justify-between px-4 text-[13px] font-semibold text-gray-200 select-none z-50 border-b border-white/5 top-bar-drag">
      <div className="flex items-center no-drag">
        <button
          onClick={onAddClick}
          className="bg-white/5 hover:bg-white/15 text-white/80 hover:text-white px-3 py-1 rounded-md transition-all border border-white/5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider cursor-pointer"
        >
          <Plus size={14} strokeWidth={3} /> Add
        </button>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 hover:text-white cursor-default tracking-wide font-bold transition-colors">
        {formatTime(time)}
      </div>

      <div className="w-[100px]"></div>
    </div>
  );
};

export default TopBar;
