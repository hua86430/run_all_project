import { ipcMain } from "electron";
import fs from "node:fs";
import { LogRequest } from "../../src/classes/logRequest";

export function getLogs() {
  ipcMain.handle("read-log", async (event, request: LogRequest) => {
    try {
      return fs.readFileSync(request.path, "utf8");
    } catch (error) {
      console.error(
        `Load file error: Level: ${request.level}, Path: ${request.path}`,
        error,
      );
      return "";
    }
  });
}
