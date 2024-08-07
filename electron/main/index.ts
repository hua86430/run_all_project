import { app, BrowserWindow, ipcMain, screen, shell, Menu } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { getLogsHandler } from "./handlers/getLogsHandler";
import {
  buildAndRunProjectHandler,
  buildAndRunProjectHandlers,
} from "./handlers/buildAndRunProjectHandler";
import { initProjectConfigFile } from "./useProjectConfig";
import { SaveProjectConfigsHandler } from "./handlers/saveProjectConfigsHandler";
import { getProjectConfigsHandler } from "./handlers/getProjectConfigsHandler";
import { killProcessHandler } from "./handlers/killProcessHandler";
import { processStatusHandler } from "./handlers/processStatusHandler";
import { InvokeResponse } from "../../src/classes/invokeResponse";
import checkUpdate from "../../checkUpdate";
// import { autoUpdater } from "electron-updater";
const require = createRequire(import.meta.url);
const { autoUpdater } = require("electron-updater");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

async function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { height } = primaryDisplay.workAreaSize;
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: VITE_DEV_SERVER_URL ? 1440 : 1024,
    height: VITE_DEV_SERVER_URL ? 768 : 768,
    x: VITE_DEV_SERVER_URL ? 200 : undefined,
    y: VITE_DEV_SERVER_URL ? height * 0.5 - 360 : undefined,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });
  autoUpdater.updateConfigPath = path.join("dev-app-update.yml");

  // checkUpdate(win, ipcMain);
  await autoUpdater.checkForUpdatesAndNotify();

  ipcMain.handle("install", () => {
    autoUpdater.quitAndInstall();
  });
  if (VITE_DEV_SERVER_URL) {
    // #298

    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
    Menu.setApplicationMenu(null);
  }

  autoUpdater.on("update-available", () => {
    console.log(123);
    win?.webContents.send("update-available");
  });

  autoUpdater.on("update-downloaded", () => {
    win?.webContents.send("update-downloaded");
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
  processStatusHandler();
  getLogsHandler();
  buildAndRunProjectHandler();
  buildAndRunProjectHandlers();
  SaveProjectConfigsHandler();
  getProjectConfigsHandler();
  killProcessHandler();
}

app.whenReady().then(async () => {
  Object.defineProperty(app, "isPackaged", {
    get() {
      return true;
    },
  });
  initProjectConfigFile();
  await createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
