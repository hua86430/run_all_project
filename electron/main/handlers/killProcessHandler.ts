import { ipcMain } from "electron";
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { killProcessByName } from "../useProcess";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";

export function killProcessHandler() {
  ipcMain.handle(
    InvokeEvent.KILL_PROCESS,
    async (event, processName: string): Promise<InvokeResponse> => {
      console.log("Kill process: ", processName);
      await killProcessByName(processName);

      return InvokeResponse.success("Kill process successful");
    },
  );
}
