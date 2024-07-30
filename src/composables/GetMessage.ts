import { LogRequest } from "../classes/logRequest";

export async function getMessage(request: LogRequest) {
  return await window.ipcRenderer.invoke("read-log", request);
}
