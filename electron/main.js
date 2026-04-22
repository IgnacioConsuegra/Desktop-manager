const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const dataPath = path.join(app.getPath("userData"), "desktop-data.json");

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    title: "Desktop Manager",
    icon: path.join(__dirname, "../public/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.argv.includes("--dev")) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// En electron/main.js
ipcMain.handle("process-file-path", async (event, filePath) => {
  try {
    let targetPath = filePath;

    // Si es un acceso directo de Windows, intentamos ver a dónde apunta
    if (filePath.toLowerCase().endsWith(".lnk")) {
      try {
        const shortcut = shell.readShortcutLink(filePath);
        if (shortcut.target) {
          targetPath = shortcut.target; // Ahora tenemos la ruta al .exe real
        }
      } catch (e) {
        // Si falla al leer el link (por permisos), seguimos con la ruta original
      }
    }

    const fileName = path.basename(filePath, path.extname(filePath));
    const icon = await app.getFileIcon(targetPath, { size: "large" });

    return {
      success: true,
      name: fileName,
      icon: icon.toDataURL(),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("save-data", (event, data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("load-data", () => {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf-8");
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
});

ipcMain.on("open-path", (event, targetPath) => {
  shell.openPath(targetPath);
});

ipcMain.handle("select-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "Seleccionar Aplicación o Archivo",
    buttonLabel: "Agregar a mi App",
    // Quitamos 'openDirectory' temporalmente para forzar a Windows a mostrar archivos
    properties: ["openFile", "dontAddToRecent"],
    filters: [
      { name: "Todos los archivos", extensions: ["*"] },
      {
        name: "Aplicaciones",
        extensions: ["exe", "lnk", "app", "mp3", "mp4", "jpg", "png", "url"],
      },
    ],
  });

  if (canceled || filePaths.length === 0) {
    return null;
  } else {
    return filePaths[0];
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
