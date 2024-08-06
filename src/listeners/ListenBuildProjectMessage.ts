import { Ref } from "vue";
import { ListenerEvent } from "../enums/ListenerEvent";

export function listenBuildProjectMessage(
  projectName: string,
  callback: (message: string) => void,
) {
  const listener = (event: any, message: string) => {
    callback(message);
  };
  window.ipcRenderer.on(
    `${projectName}-${ListenerEvent.BUILD_OUTPUT}`,
    listener,
  );
}
