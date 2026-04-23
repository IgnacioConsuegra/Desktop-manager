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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#121212] w-full max-w-3xl rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Editar lista" : "Nueva lista"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre de la lista"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500"
              />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descripción..."
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none h-20 resize-none"
              />
            </div>
            <div className="w-32 flex flex-col items-center gap-2">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-32 h-32 bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative group"
              >
                {customImage ? (
                  <img
                    src={customImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Plus className="opacity-30 group-hover:opacity-100" />
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
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar aplicaciones para añadir..."
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none"
            />
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
              {allItems
                .filter(it =>
                  it.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedIds.includes(item.id) ? "bg-orange-600/20 border border-orange-500/50" : "bg-white/5 border border-transparent"}`}
                  >
                    <img
                      src={item.iconData}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-xs truncate">{item.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-white text-black px-8 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListModal;
