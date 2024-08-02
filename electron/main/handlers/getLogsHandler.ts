import { ipcMain } from "electron";
import fs from "node:fs";
import { LogRequest } from "../../../src/classes/logRequest";

export function getLogsHandler() {
  ipcMain.handle("read-log", async (event, request: LogRequest) => {
    try {
      return (
        fs.readFileSync(request.path, "utf8").replace(/\r?\n/g, "<br>") + "<br>"
      );
    } catch (error) {
      console.error(
        `Load file error: Level: ${request.level}, Path: ${request.path}`,
        error,
      );
      return "";
    }
  });
}
