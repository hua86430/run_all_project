import {createRequire} from "node:module";
import { BrowserWindow, IpcMain } from 'electron';
import path from "node:path";
const require = createRequire(import.meta.url);
const {autoUpdater} = require("electron-updater");


let mainWin: BrowserWindow | null = null;

const checkUpdate = (win: BrowserWindow, ipcMain: IpcMain): void => {
    if (process.env.NODE_ENV === 'development') {
        autoUpdater.updateConfigPath = path.join("dev-app-update.yml");
    }
    autoUpdater.autoDownload = true; // 自動下載
    autoUpdater.autoInstallOnAppQuit = true; // 應用退出後自動安裝
    mainWin = win;
    // 檢測是否有更新包並通知
    autoUpdater.checkForUpdatesAndNotify().catch(() => {
        console.error('Failed to check for updates');
    });
    // 監聽渲染進程的 install 事件，觸發退出應用並安裝
    ipcMain.handle('install', () => {
        autoUpdater.quitAndInstall();
    });
};

export default checkUpdate;
