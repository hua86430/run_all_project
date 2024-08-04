import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { ipcMain } from "electron";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { useLogger } from "../useLogger";

export function useHandler(
  eventName: InvokeEvent,
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any,
) {
  ipcMain.handle(eventName, async (event, ...args) => {
    try {
      return await listener(event, ...args);
    } catch (error) {
      useLogger.error(error.stack);

      return InvokeResponse.error(error.message);
    }
  });
}
