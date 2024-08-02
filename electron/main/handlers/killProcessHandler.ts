import { ipcMain } from "electron";
import { exec } from "child_process";
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { killExistProcess } from "../killExistProcess";

export function killProcessHandler() {
  ipcMain.handle(
    "kill-process",
    async (event, processName: string): Promise<InvokeResponse> => {
      console.log("Kill process: ", processName);
      await killExistProcess(processName);

      return InvokeResponse.success("Kill process successful");
    },
  );
}
