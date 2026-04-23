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
    <div className="h-8 w-full bg-black/90 flex items-center justify-between px-5 text-[13px] font-semibold text-gray-200 select-none z-40 shadow-md border-b border-white/5">
      <div className="hover:text-white cursor-default"></div>
      <div className="absolute left-1/2 -translate-x-1/2 hover:text-white cursor-default tracking-wide font-bold">
        {formatTime(time)}
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={onAddClick}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md transition-colors border border-white/10 flex items-center gap-1 text-xs"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
};

export default TopBar;
