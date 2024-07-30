import { ipcMain } from "electron";
import fs from "node:fs";
import { LogRequest } from "../../src/classes/logRequest";

export function getLogs() {
  ipcMain.handle("read-log", async (event, request: LogRequest) => {
    try {
      return fs.readFileSync(request.path, "utf8");
    } catch (error) {
      console.error("讀取文件錯誤:", error);
      return "";
    }
  });
}
