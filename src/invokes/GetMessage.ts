import { LogRequest } from "../classes/logRequest";
import { InvokeEvent } from "../enums/InvokeEvent";

export async function getMessage(request: LogRequest) {
  return await window.ipcRenderer.invoke(InvokeEvent.GET_LOGS, request);
}
