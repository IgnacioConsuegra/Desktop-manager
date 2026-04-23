import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Plus } from "lucide-react";
import Swal from "sweetalert2";

import AppIcon from "./components/AppIcon";
import AppListIcon from "./components/AppListIcon";
import ListModal from "./components/ListModal";
import ListView from "./components/ListView";
import TopBar from "./components/TopBar";

const App = () => {
  const [items, setItems] = useState([]);
  const [appLists, setAppLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [currentView, setCurrentView] = useState({ type: "home", data: null });
  const [selectedList, setSelectedList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListData, setEditingListData] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (window.electronAPI) {
        const data = await window.electronAPI.loadData();
        if (data?.items) setItems(data.items);
        if (data?.appLists) setAppLists(data.appLists);
      }
    };
    load();
  }, []);

  const save = (newItems, newLists) => {
    if (window.electronAPI)
      window.electronAPI.saveData({ items: newItems, appLists: newLists });
  };

  const handleAddApp = async () => {
    if (!window.electronAPI) return;
    const path = await window.electronAPI.selectFile();
    if (!path) return;
    const res = await window.electronAPI.processFilePath(path);
    if (res.success) {
      const { value: name } = await Swal.fire({
        title: "Nombre",
        input: "text",
        inputValue: res.name,
        background: "#2b0a1d",
        color: "#fff",
        confirmButtonColor: "#e95420",
      });
      if (!name) return;
      const newList = [
        ...items,
        {
          id: Date.now().toString(),
          name,
          path,
          iconData: res.icon,
          isFavorite: false,
        },
      ];
      setItems(newList);
      save(newList, appLists);
    }
  };

  const onExecute = path => {
    if (window.electronAPI) window.electronAPI.openFile(path);
  };

  const filteredItems = items.filter(it =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const activeList =
    currentView.type === "list"
      ? appLists.find(l => l.id === currentView.data.id)
      : null;
  useEffect(() => {
    if (selectedList) {
      setCurrentView({ type: "list", data: selectedList });
    }
  }, [selectedList]);
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#4c1933] via-[#2b0a1d] to-[#1e0814] text-white overflow-hidden select-none font-sans">
      <TopBar onAddClick={handleAddApp} />

      {!selectedList ? (
        <>
          <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center">
            {currentView.type === "home" ? (
              <div className="w-full max-w-6xl">
                <div className="relative max-w-2xl mx-auto mb-16 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    placeholder="Escriba para buscar..."
                    className="w-full bg-black/40 rounded-full py-4 pl-16 pr-8 border border-white/10 outline-none focus:border-white/30 backdrop-blur-xl text-lg"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {items.some(i => i.isFavorite) && (
                  <section className="mb-12">
                    <h3 className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mb-6 ml-4">
                      Favoritos
                    </h3>
                    <div className="flex flex-wrap gap-6">
                      {items
                        .filter(i => i.isFavorite)
                        .map(it => (
                          <AppIcon
                            key={it.id}
                            {...it}
                            onDoubleClick={onExecute}
                            onToggleFavorite={id => {
                              const n = items.map(i =>
                                i.id === id
                                  ? { ...i, isFavorite: !i.isFavorite }
                                  : i,
                              );
                              setItems(n);
                              save(n, appLists);
                            }}
                            onDelete={id => {
                              const n = items.filter(i => i.id !== id);
                              setItems(n);
                              save(n, appLists);
                            }}
                          />
                        ))}
                    </div>
                  </section>
                )}

                <section className="mb-12">
                  <div
                    className="flex items-center gap-2 mb-6 ml-4 cursor-pointer"
                    onClick={() => setIsListExpanded(!isListExpanded)}
                  >
                    <h3 className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em]">
                      Lista de Aplicaciones
                    </h3>
                    {isListExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                  {isListExpanded && (
                    <div className="flex flex-wrap gap-6">
                      {appLists.map(list => (
                        <AppListIcon
                          key={list.id}
                          list={list}
                          allItems={items}
                          onEdit={l => {
                            setEditingListData(l);
                            setIsModalOpen(true);
                          }}
                          onDelete={id => {
                            const n = appLists.filter(l => l.id !== id);
                            setAppLists(n);
                            save(items, n);
                          }}
                          onClick={l => setSelectedList(l)}
                        />
                      ))}
                      <div
                        onClick={() => {
                          setEditingListData(null);
                          setIsModalOpen(true);
                        }}
                        className="w-32 h-44 flex flex-col items-center justify-center border border-dashed border-white/20 rounded-2xl hover:bg-white/5 cursor-pointer transition-all group"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 mb-4">
                          <Plus className="opacity-40 group-hover:opacity-100" />
                        </div>
                        <span className="text-[11px] font-bold text-white/40 uppercase">
                          Crear Lista
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] mb-6 ml-4">
                    Todas las Aplicaciones
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {filteredItems.map(it => (
                      <AppIcon
                        key={it.id}
                        {...it}
                        onDoubleClick={onExecute}
                        onToggleFavorite={id => {
                          const n = items.map(i =>
                            i.id === id
                              ? { ...i, isFavorite: !i.isFavorite }
                              : i,
                          );
                          setItems(n);
                          save(n, appLists);
                        }}
                        onDelete={id => {
                          const n = items.filter(i => i.id !== id);
                          setItems(n);
                          save(n, appLists);
                        }}
                      />
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <ListView
                list={currentView.data}
                allItems={items}
                onBack={() => setCurrentView({ type: "home", data: null })}
                onExecuteApp={onExecute}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <ListView
            list={activeList}
            allItems={items}
            onBack={() =>
              setCurrentView(
                { type: "home", data: null },
                setSelectedList(null),
              )
            }
            onExecuteApp={onExecute}
            onToggleFavorite={id => {
              const n = items.map(i =>
                i.id === id ? { ...i, isFavorite: !i.isFavorite } : i,
              );
              setItems(n);
              save(n, appLists);
            }}
            onEdit={listToEdit => {
              setEditingListData(listToEdit);
              setIsModalOpen(true);
            }}
            onRemoveApp={appIdToRemove => {
              const updatedList = {
                ...currentView.data,
                appIds: currentView.data.appIds.filter(
                  id => id !== appIdToRemove,
                ),
              };
              const newLists = appLists.map(l =>
                l.id === updatedList.id ? updatedList : l,
              );
              setAppLists(newLists);
              save(items, newLists);
              setCurrentView({ type: "list", data: updatedList });
            }}
          />
        </>
      )}
      <ListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allItems={items}
        initialData={editingListData}
        onSave={l => {
          const n = editingListData
            ? appLists.map(it => (it.id === l.id ? l : it))
            : [...appLists, l];
          setAppLists(n);
          save(items, n);
        }}
      />
    </div>
  );
};

export default App;
