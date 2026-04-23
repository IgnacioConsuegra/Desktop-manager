const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const dataPath = path.join(app.getPath("userData"), "desktop-data.json");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "icon.png"),
    // autoHideMenuBar: true,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#000000",
      symbolColor: "#ffffff",
      height: 32,
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenu(null);

  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F11" && input.type === "keyDown") {
      const isFullScreen = win.isFullScreen();
      win.setFullScreen(!isFullScreen);
    }
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
};

ipcMain.handle("process-file-path", async (event, filePath) => {
  try {
    let targetPath = filePath;

    if (filePath.toLowerCase().endsWith(".lnk")) {
      try {
        const shortcut = shell.readShortcutLink(filePath);
        if (shortcut.target) {
          targetPath = shortcut.target;
        }
      } catch (e) {}
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
    title: "Select file or app",
    buttonLabel: "Add to app",
    properties: ["openFile", "dontAddToRecent"],
    filters: [
      { name: "All files", extensions: ["*"] },
      {
        name: "Apps",
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
