import { createRequire } from "node:module";
import { BrowserWindow, IpcMain, app } from "electron";
import path from "node:path";
import { useLogger } from "./electron/main/useLogger";
const require = createRequire(import.meta.url);
const { autoUpdater } = require("electron-updater");

let mainWin: BrowserWindow | null = null;
const checkUpdate = async (
  win: BrowserWindow,
  ipcMain: IpcMain,
): Promise<void> => {
  useLogger.info("[Update] Checking for updates");
  if (process.env.NODE_ENV === "development") {
    autoUpdater.updateConfigPath = path.join("dev-app-update.yml");
  }
  autoUpdater.autoDownload = true; // 自動下載
  autoUpdater.autoInstallOnAppQuit = true; // 應用退出後自動安裝
  mainWin = win;
  // 檢測是否有更新包並通知

  try {
    const updateCheckResult = await autoUpdater.checkForUpdatesAndNotify({
      title: "Have a new version",
      body: "There's a new version of the app available. Restart to update.",
    });

    if (updateCheckResult.updateInfo.version !== app.getVersion()) {
      await autoUpdater.downloadUpdate();
      useLogger.info(
        `[Update] Update available: ${updateCheckResult.updateInfo.version}`,
      );
      // 你可以在這裡處理找到更新後的行為
    } else {
      useLogger.info("[Update] No updates available.");
    }
  } catch (e) {
    useLogger.error(`[Update] Failed to check for updates :: ${e.message}`);
  }

  // 監聽渲染進程的 install 事件，觸發退出應用並安裝
  ipcMain.handle("install", () => {
    autoUpdater.quitAndInstall();
  });
};

export default checkUpdate;
