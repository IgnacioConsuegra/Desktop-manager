import React from "react";
import { ArrowLeft, Folder, Play, Pencil } from "lucide-react";
import AppIcon from "./AppIcon";
const ListView = ({
  list,
  allItems,
  onBack,
  onExecuteApp,
  onEdit,
  onRemoveApp,
  onToggleFavorite,
}) => {
  if (!list) return <h2>No list</h2>;

  const listItems = list.appIds
    .map(id => allItems.find(i => i.id === id))
    .filter(Boolean);

  const handleLaunchAll = () => {
    listItems.forEach(item => {
      onExecuteApp(item.path);
    });
  };

  return (
    <div className="w-full max-w-5xl animate-in fade-in slide-in-from-left-4 duration-300 px-2 md:px-8 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-xs font-bold uppercase tracking-widest">
          Volver
        </span>
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-12 md:mb-16 bg-black/20 p-6 md:p-10 rounded-3xl backdrop-blur-md border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-2xl z-10 flex-shrink-0">
          {list.customImage ? (
            <img
              src={list.customImage}
              className="w-full h-full object-cover rounded-xl"
              alt="List Cover"
            />
          ) : (
            <Folder
              size={60}
              className="mx-auto mt-4 text-white/20 md:w-20 md:h-20"
            />
          )}
        </div>

        <div className="flex flex-col gap-3 z-10 flex-1 text-center md:text-left w-full">
          <h1 className="text-4xl md:text-5xl font-black text-white">
            {list.name}
          </h1>
          <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em]"></span>
          <p className="text-white/50 text-sm max-w-xl mx-auto md:mx-0">
            {list.description || "Esta lista no tiene descripción."}
          </p>
        </div>

        <div className="z-10 mt-4 md:mt-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => onEdit(list)}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 md:py-4 rounded-full font-bold transition-all shadow-lg border border-white/10"
          >
            <Pencil size={18} />
            <span className="text-sm">Editar</span>
          </button>

          <button
            onClick={handleLaunchAll}
            disabled={listItems.length === 0}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 py-3.5 md:py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 border border-white/10"
          >
            <Play size={18} fill="currentColor" />
            <span className="text-sm">Ejecutar Todo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
        {listItems.map(item => (
          <AppIcon
            key={item.id}
            {...item}
            onDoubleClick={onExecuteApp}
            showActions={true}
            onDelete={() => onRemoveApp(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListView;
