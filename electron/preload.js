const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveData: data => ipcRenderer.invoke("save-data", data),
  loadData: () => ipcRenderer.invoke("load-data"),
  processFilePath: path => ipcRenderer.invoke("process-file-path", path),
  openFile: path => ipcRenderer.send("open-path", path),
  selectFile: () => ipcRenderer.invoke("select-file"),
});
