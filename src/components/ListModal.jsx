import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Search } from "lucide-react";

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
        setDescription(initialData.description || "");
        setSelectedIds(initialData.appIds || []);
        setCustomImage(initialData.customImage || null);
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

  const toggleItem = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-gradient-to-br from-[#2b0a1d]/95 to-[#1e0814]/95 w-full max-w-3xl rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            {initialData ? "Edit List" : "New List"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-8 custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-5">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="List Name"
                className="w-full bg-black/40 text-white rounded-xl px-5 py-4 border border-white/10 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 shadow-inner text-sm transition-all"
              />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description..."
                className="w-full bg-black/40 text-white rounded-xl px-5 py-4 border border-white/10 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 shadow-inner text-sm transition-all h-28 resize-none"
              />
            </div>
            <div className="w-full md:w-40 flex flex-col items-center gap-3">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-40 h-40 bg-black/40 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-orange-500/50 transition-colors shadow-inner"
              >
                {customImage ? (
                  <img
                    src={customImage}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Plus size={32} className="text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      Cover
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={e => {
                  const reader = new FileReader();
                  reader.onload = () => setCustomImage(reader.result);
                  reader.readAsDataURL(e.target.files[0]);
                }}
              />
              {customImage && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setCustomImage(null);
                  }}
                  className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-widest transition-colors mt-1"
                >
                  Remove Cover
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center group">
              <Search
                className="absolute left-5 text-white/30 group-focus-within:text-orange-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search applications to add..."
                className="w-full bg-black/40 text-white rounded-full pl-12 pr-6 py-3.5 border border-white/10 focus:outline-none focus:border-orange-500/50 focus:bg-black/60 shadow-inner text-sm transition-all"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {allItems
                .filter(it =>
                  it.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      selectedIds.includes(item.id)
                        ? "bg-orange-600/20 border-orange-500/50 shadow-[0_0_15px_rgba(233,84,32,0.15)]"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <div className="w-8 h-8 bg-black/20 rounded-lg p-1.5 flex-shrink-0">
                      <img
                        src={item.iconData}
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                    <span className="text-xs font-medium truncate text-gray-200">
                      {item.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-10 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95 border border-white/10"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListModal;
