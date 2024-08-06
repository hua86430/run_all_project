import { Ref } from "vue";
import { ListenerEvent } from "../enums/ListenerEvent";

export function listenRunProjectMessage(
  projectName: string,
  callback: (message: string) => void,
) {
  const listener = (event: any, message: string) => {
    callback(message);
  };
  window.ipcRenderer.on(`${projectName}-${ListenerEvent.RUN_OUTPUT}`, listener);
}
