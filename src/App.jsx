import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Folder,
  Pencil,
  Trash2,
  Image as ImageIcon,
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

const AppListIcon = ({ list, allItems, onEdit, onDelete, onDoubleClick }) => {
  const listItems = list.appIds
    .map(id => allItems.find(i => i.id === id))
    .filter(Boolean);
  const previewItems = listItems.slice(0, 4);

  return (
    <div
      className="relative flex flex-col items-center justify-start p-4 w-32 h-44 hover:bg-white/10 rounded-2xl cursor-pointer transition-all duration-200 group border border-transparent hover:border-white/10"
      onDoubleClick={() => onDoubleClick(list)}
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

const ListModal = ({ isOpen, onClose, onSave, allItems, initialData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [customImage, setCustomImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description);
        setSelectedIds(initialData.appIds);
        setCustomImage(initialData.customImage);
      } else {
        setName("");
        setDescription("");
        setSelectedIds([]);
        setCustomImage(null);
      }
      setSearch("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const availableItems = allItems.filter(
    item =>
      !selectedIds.includes(item.id) &&
      item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedItems = selectedIds
    .map(id => allItems.find(i => i.id === id))
    .filter(Boolean);

  const toggleItem = id => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initialData ? initialData.id : Date.now().toString(),
      name,
      description,
      appIds: selectedIds,
      customImage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#121212] w-full max-w-3xl rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {initialData
              ? "Editar lista de aplicaciones"
              : "Crear nueva lista de aplicaciones"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
          <div className="flex gap-6">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Nombre de la lista
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Mi increíble lista..."
                  className="bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Una breve descripción..."
                  rows={2}
                  className="bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-48">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">
                Icono personalizado
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-full h-32 bg-[#1e1e1e] border border-dashed border-white/20 hover:border-white/50 rounded-xl flex items-center justify-center cursor-pointer transition-colors overflow-hidden relative group"
              >
                {customImage ? (
                  <img
                    src={customImage}
                    alt="Custom"
                    className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={32} className="text-white" />
                    <span className="text-[10px] text-white uppercase tracking-widest">
                      Subir Imagen
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              {customImage && (
                <button
                  onClick={() => setCustomImage(null)}
                  className="text-[11px] text-red-400 hover:text-red-300 text-center mt-1"
                >
                  Quitar imagen
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Buscar aplicaciones
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {search.trim() !== "" && availableItems.length > 0 && (
            <div className="bg-[#1e1e1e] rounded-lg p-2 border border-white/5 max-h-40 overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2">
              {availableItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 flex-shrink-0">
                    {item.iconData ? (
                      <img
                        src={item.iconData}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Folder size={24} className="text-orange-400" />
                    )}
                  </div>
                  <span className="text-sm text-gray-200 truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 mt-2 border-t border-white/5 pt-6">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Aplicaciones añadidas ({selectedItems.length})
            </label>

            {selectedItems.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No hay aplicaciones añadidas aún.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-[#1e1e1e] border border-white/5 p-2 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-6 h-6 flex-shrink-0">
                        {item.iconData ? (
                          <img
                            src={item.iconData}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Folder size={18} className="text-orange-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-200 truncate">
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-gray-200 hover:bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? "Guardar Cambios" : "Crear Lista"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DesktopManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [appLists, setAppLists] = useState([]);
  const [isListExpanded, setIsListExpanded] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListData, setEditingListData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI) {
        const data = await window.electronAPI.loadData();
        if (data) {
          if (data.items) setItems(data.items);
          if (data.appLists) setAppLists(data.appLists);
        }
      }
    };
    loadData();
  }, []);

  const saveToDisk = async (newItems, newLists) => {
    if (window.electronAPI) {
      await window.electronAPI.saveData({
        items: newItems,
        appLists: newLists,
      });
    }
  };

  const toggleFavorite = id => {
    const newItems = items.map(it =>
      it.id === id ? { ...it, isFavorite: !it.isFavorite } : it,
    );
    setItems(newItems);
    saveToDisk(newItems, appLists);
  };

  const deleteItem = id => {
    const newItems = items.filter(it => it.id !== id);
    const newLists = appLists.map(list => ({
      ...list,
      appIds: list.appIds.filter(appId => appId !== id),
    }));
    setItems(newItems);
    setAppLists(newLists);
    saveToDisk(newItems, newLists);
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
      const { value: customName } = await Swal.fire({
        title: "Nombre de la aplicación",
        input: "text",
        inputValue: res.name,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        background: "#2b0a1d",
        color: "#fff",
        confirmButtonColor: "#e95420",
        inputAttributes: {
          autocapitalize: "off",
        },
        customClass: {
          input:
            "bg-black/20 text-white border-white/10 focus:ring-orange-500 rounded-lg",
        },
      });

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
      saveToDisk(updatedList, appLists);
    }
  };

  const handleSaveAppList = listData => {
    let newLists;
    if (editingListData) {
      newLists = appLists.map(l => (l.id === listData.id ? listData : l));
    } else {
      newLists = [...appLists, listData];
    }
    setAppLists(newLists);
    saveToDisk(items, newLists);
  };

  const handleDeleteAppList = id => {
    const newLists = appLists.filter(l => l.id !== id);
    setAppLists(newLists);
    saveToDisk(items, newLists);
  };

  const openCreateModal = () => {
    setEditingListData(null);
    setIsModalOpen(true);
  };

  const openEditModal = list => {
    setEditingListData(list);
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(it =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const favorites = filteredItems.filter(it => it.isFavorite);

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
                {appLists.map(list => (
                  <AppListIcon
                    key={list.id}
                    list={list}
                    allItems={items}
                    onEdit={openEditModal}
                    onDelete={handleDeleteAppList}
                    onDoubleClick={list => {
                      handleOpenList(list);
                    }}
                  />
                ))}

                <div
                  onClick={openCreateModal}
                  className="relative flex flex-col items-center justify-center p-4 w-32 h-44 hover:bg-white/5 rounded-2xl cursor-pointer transition-all duration-200 group border border-dashed border-white/20 hover:border-white/50"
                >
                  <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Plus
                      size={28}
                      className="text-white/50 group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-white/50 text-[13px] text-center leading-tight font-medium group-hover:text-white transition-colors">
                    Crear lista de aplicaciones
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h3 className="text-white/80 text-[11px] font-bold tracking-[0.2em] mb-6 text-left drop-shadow-md uppercase px-4">
              Todas las Aplicaciones
            </h3>
            <div className="flex flex-wrap gap-6 justify-start px-2">
              {filteredItems.map(it => (
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

      <ListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppList}
        allItems={items}
        initialData={editingListData}
      />
    </div>
  );
};

export default DesktopManager;
