import React from "react";
import { Trash2, Pencil, Folder } from "lucide-react";
const AppListIcon = ({
  list,
  allItems,
  onEdit,
  onDelete,
  onDoubleClick,
  onClick,
}) => {
  const listItems = list.appIds
    .map(id => allItems.find(i => i.id === id))
    .filter(Boolean);
  const previewItems = listItems.slice(0, 4);

  return (
    <div
      className="relative flex flex-col items-center justify-start p-4 w-32 h-44 hover:bg-white/10 rounded-2xl cursor-pointer transition-all duration-200 group border border-transparent hover:border-white/10"
      onDoubleClick={() => onClick(list)}
    >
      <div
        onClick={e => {
          e.stopPropagation();
          onDelete(list.id);
        }}
        className="absolute top-2 left-2 p-1.5 cursor-pointer z-20 hover:scale-110 transition-transform bg-red-500/90 rounded-full opacity-0 group-hover:opacity-100 shadow-md border border-white/20"
      >
        <Trash2 size={12} color="white" strokeWidth={2.5} />
      </div>
      <div
        onClick={e => {
          e.stopPropagation();
          onEdit(list);
        }}
        className="absolute top-2 right-2 p-1.5 cursor-pointer z-20 hover:scale-125 transition-transform bg-black/40 rounded-full backdrop-blur-md border border-white/5 shadow-lg"
      >
        <Pencil size={14} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
      </div>
      <div className="w-20 h-20 rounded-2xl mb-4 flex items-center justify-center shadow-2xl bg-gradient-to-b from-white/5 to-white/10 p-3 backdrop-blur-md border border-white/5 overflow-hidden">
        {list.customImage ? (
          <img
            src={list.customImage}
            alt={list.name}
            className="w-full h-full object-cover rounded-xl shadow-inner"
          />
        ) : previewItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 w-full h-full">
            {previewItems.map((item, i) => (
              <div
                key={i}
                className="w-full h-full flex items-center justify-center bg-black/20 rounded-md p-1"
              >
                {item.iconData ? (
                  <img
                    src={item.iconData}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Folder size={12} className="text-orange-400" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <Folder size={44} className="text-white/20" />
        )}
      </div>
      <span className="text-gray-100 text-[13px] text-center leading-tight line-clamp-2 w-full font-medium drop-shadow-lg group-hover:text-white">
        {list.name}
      </span>
    </div>
  );
};
export default AppListIcon;
