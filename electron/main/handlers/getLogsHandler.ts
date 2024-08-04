import fs from "node:fs";
import { LogRequest } from "../../../src/classes/logRequest";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { useHandler } from "./useHandler";

export function getLogsHandler() {
  useHandler(InvokeEvent.GET_LOGS, async (event, request: LogRequest) => {
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
