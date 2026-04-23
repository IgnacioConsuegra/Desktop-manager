import { X, Heart, Folder, AppleIcon } from "lucide-react";
import React from "react";
const AppIcon = ({
  id,
  name,
  path,
  iconData,
  isFavorite,
  onDoubleClick,
  onToggleFavorite,
  onDelete,
}) => {
  return (
    <div
      className="relative flex flex-col items-center justify-start p-4 w-32 h-44 hover:bg-white/10 rounded-2xl cursor-pointer transition-all duration-200 group border border-transparent hover:border-white/10"
      onDoubleClick={() => onDoubleClick(path)}
    >
      <div
        onClick={e => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute top-2 left-2 p-1 cursor-pointer z-20 hover:scale-110 transition-transform bg-red-500/90 rounded-full opacity-0 group-hover:opacity-100 shadow-md border border-white/20"
      >
        <X size={12} color="white" strokeWidth={3} />
      </div>
      <div
        onClick={e => {
          e.stopPropagation();
          onToggleFavorite(id);
        }}
        className="absolute top-2 right-2 p-1.5 cursor-pointer z-20 hover:scale-125 transition-transform bg-black/40 rounded-full backdrop-blur-md border border-white/5 shadow-lg"
      >
        <Heart
          size={14}
          fill={isFavorite ? "#ff4d4d" : "transparent"}
          color={isFavorite ? "#ff4d4d" : "rgba(255,255,255,0.8)"}
          strokeWidth={2.5}
        />
      </div>
      <div className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center shadow-2xl bg-gradient-to-b from-white/5 to-white/10 p-3 backdrop-blur-md border border-white/5">
        {iconData && iconData.startsWith("data:image") ? (
          <img
            src={iconData}
            alt={name}
            className="w-full h-full object-contain filter drop-shadow-xl"
          />
        ) : (
          <Folder size={44} className="text-orange-400 fill-orange-400/20" />
        )}
      </div>
      <span className="text-gray-100 text-[13px] text-center leading-tight line-clamp-2 w-full font-medium drop-shadow-lg group-hover:text-white">
        {name}
      </span>
    </div>
  );
};
export default AppIcon;
