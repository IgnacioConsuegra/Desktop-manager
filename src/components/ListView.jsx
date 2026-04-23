import React, { useState } from "react";
import { ArrowLeft, Folder, Play, Pencil, Search } from "lucide-react";
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
  const [internalSearch, setInternalSearch] = useState("");

  if (!list)
    return (
      <h2 className="text-white text-center mt-10 font-bold">
        No se encontró la lista
      </h2>
    );

  const listItems = list.appIds
    .map(id => allItems.find(i => i.id === id))
    .filter(Boolean);

  const filteredListItems = listItems.filter(item =>
    item.name.toLowerCase().includes(internalSearch.toLowerCase()),
  );

  const handleLaunchAll = () => {
    filteredListItems.forEach(item => {
      onExecuteApp(item.path);
    });
  };

  return (
    <div className="w-screen  animate-in fade-in slide-in-from-left-4 duration-300 px-2 md:px-8 pb-10 py-10 ">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-xs font-bold uppercase tracking-widest">
          Go back
        </span>
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 mb-8 bg-black/20 p-6 md:p-10 rounded-3xl backdrop-blur-md border border-white/5 relative overflow-hidden">
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

        <div className="flex flex-col z-10 flex-1 text-center md:text-left w-full pt-2">
          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
            {list.name}
          </h1>

          {/* Descripción */}
          <p className="text-white/60 text-sm max-w-xl mx-auto md:mx-0 font-medium mb-6">
            {list.description || "No description"}
          </p>

          {/* Contenedor de Botones - Ahora forzamos columna siempre o flex-start */}
          <div className="z-10 flex flex-col sm:flex-row gap-3 w-full md:w-max">
            <button
              onClick={() => onEdit(list)}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg border border-white/10"
            >
              <Pencil size={18} />
              <span className="text-sm">Edit</span>
            </button>

            <button
              onClick={handleLaunchAll}
              disabled={listItems.length === 0}
              className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 border border-white/10"
            >
              <Play size={18} fill="currentColor" />
              <span className="text-sm">Run all</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda interna ajustada */}
      <div className="w-full mb-10 group">
        {" "}
        {/* Eliminado max-w-md para que ocupe el width del contenedor */}
        <div className="relative flex items-center">
          <Search
            className="absolute left-5 text-white/50 group-focus-within:text-orange-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search on ${list.name}...`}
            className="w-full bg-black/40 text-white rounded-xl pl-12 pr-6 py-3 border border-white/5 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 shadow-2xl text-sm transition-all backdrop-blur-md"
            value={internalSearch}
            onChange={e => setInternalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grilla de Apps filtrada */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
        {filteredListItems.length > 0 ? (
          filteredListItems.map(item => (
            <AppIcon
              key={item.id}
              {...item}
              onDoubleClick={onExecuteApp}
              showActions={true}
              onDelete={() => onRemoveApp(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-10 opacity-30 flex flex-col items-center">
            <Folder size={48} className="mb-2" />
            <p className="text-sm italic">No se encontraron aplicaciones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
