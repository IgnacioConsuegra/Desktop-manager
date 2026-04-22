import React, { useState, useEffect } from "react";
import {
  Heart,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Folder,
} from "lucide-react";

import Swal from "sweetalert2";
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
    <div className="h-8 w-full bg-black/90 flex items-center justify-between px-5 text-[13px] font-semibold text-gray-200 select-none z-50 shadow-md border-b border-white/5">
      <div className="hover:text-white cursor-default">Actividades</div>
      <div className="absolute left-1/2 -translate-x-1/2 hover:text-white cursor-default tracking-wide font-bold">
        {formatTime(time)}
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={onAddClick}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md transition-colors border border-white/10 flex items-center gap-1 text-xs"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
    </div>
  );
};

const DesktopManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [isListExpanded, setIsListExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        const data = await window.electronAPI.loadData();
        if (data?.items) setItems(data.items);
      }
    };
    loadData();
  }, []);

  const saveToDisk = async newItems => {
    if (window.electronAPI) {
      await window.electronAPI.saveData({ items: newItems });
    }
  };

  const toggleFavorite = id => {
    const newItems = items.map(it =>
      it.id === id ? { ...it, isFavorite: !it.isFavorite } : it,
    );
    setItems(newItems);
    saveToDisk(newItems);
  };

  const deleteItem = id => {
    const newItems = items.filter(it => it.id !== id);
    setItems(newItems);
    saveToDisk(newItems);
  };

  const handleExecute = path => {
    if (window.electronAPI) {
      window.electronAPI.openFile(path);
    }
  };

  const handleAddAction = async () => {
    if (!window.electronAPI) return;

    const selectedPath = await window.electronAPI.selectFile();
    if (!selectedPath) return;

    const res = await window.electronAPI.processFilePath(selectedPath);

    if (res.success) {
      // REEMPLAZO DE PROMPT POR SWEETALERT2
      const { value: customName } = await Swal.fire({
        title: "Nombre de la aplicación",
        input: "text",
        inputValue: res.name,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        background: "#2b0a1d", // Color que combina con tu fondo Ubuntu
        color: "#fff",
        confirmButtonColor: "#e95420", // Naranja Ubuntu
        inputAttributes: {
          autocapitalize: "off",
        },
        customClass: {
          input:
            "bg-black/20 text-white border-white/10 focus:ring-orange-500 rounded-lg",
        },
      });

      // Si el usuario cancela o cierra el modal, customName será undefined
      if (customName === undefined) return;

      const updatedList = [
        ...items,
        {
          id: Date.now().toString(),
          name: customName || res.name,
          path: selectedPath,
          iconData: res.icon,
          isFavorite: false,
        },
      ];

      setItems(updatedList);
      saveToDisk(updatedList);
    }
  };

  const filteredItems = items.filter(it =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const favorites = filteredItems.filter(it => it.isFavorite);
  const otherApps = filteredItems.filter(it => !it.isFavorite);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#4c1933] via-[#2b0a1d] to-[#1e0814] text-white overflow-hidden select-none">
      <TopBar onAddClick={handleAddAction} />

      <div className="flex-1 flex flex-col items-center pt-12 px-10 overflow-y-auto scrollbar-hide w-full">
        <div className="w-full max-w-2xl mb-14 group">
          <div className="relative flex items-center">
            <Search
              className="absolute left-6 text-white/40 group-focus-within:text-white transition-colors"
              size={22}
            />
            <input
              type="text"
              placeholder="Escriba para buscar..."
              className="w-full bg-black/40 text-white rounded-full pl-16 pr-8 py-3.5 border border-white/10 focus:outline-none focus:border-white/30 focus:bg-black/60 shadow-2xl text-base transition-all backdrop-blur-xl"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full max-w-6xl space-y-12 pb-20">
          {favorites.length > 0 && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-white/80 text-[11px] font-bold tracking-[0.2em] mb-6 text-left drop-shadow-md uppercase px-4">
                Favoritos
              </h3>
              <div className="flex flex-wrap gap-6 justify-start px-2">
                {favorites.map(it => (
                  <AppIcon
                    key={it.id}
                    {...it}
                    onDoubleClick={handleExecute}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteItem}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div
              className="flex items-center gap-3 cursor-pointer w-max mb-6 group px-4"
              onClick={() => setIsListExpanded(!isListExpanded)}
            >
              <h3 className="text-white/80 text-[11px] font-bold tracking-[0.2em] text-left drop-shadow-md uppercase group-hover:text-white transition-colors">
                Lista de Aplicaciones
              </h3>
              {isListExpanded ? (
                <ChevronUp
                  size={16}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
              ) : (
                <ChevronDown
                  size={16}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
              )}
            </div>

            {isListExpanded && (
              <div className="flex flex-wrap gap-6 justify-start px-2 mb-12">
                {filteredItems.map(it => (
                  <AppIcon
                    key={it.id}
                    {...it}
                    onDoubleClick={handleExecute}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteItem}
                  />
                ))}

                <div
                  onClick={handleAddAction}
                  className="relative flex flex-col items-center justify-center p-4 w-32 h-44 hover:bg-white/5 rounded-2xl cursor-pointer transition-all duration-200 group border border-dashed border-white/20 hover:border-white/50"
                >
                  <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Plus
                      size={28}
                      className="text-white/50 group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-white/50 text-[13px] text-center leading-tight font-medium group-hover:text-white transition-colors">
                    Agregar aplicación
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h3 className="text-white/80 text-[11px] font-bold tracking-[0.2em] mb-6 text-left drop-shadow-md uppercase px-4">
              Otras Aplicaciones
            </h3>
            <div className="flex flex-wrap gap-6 justify-start px-2">
              {otherApps.map(it => (
                <AppIcon
                  key={it.id}
                  {...it}
                  onDoubleClick={handleExecute}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopManager;
