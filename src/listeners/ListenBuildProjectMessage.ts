import { Ref } from "vue";
import { ListenerEvent } from "../enums/ListenerEvent";

export function listenBuildProjectMessage(
  buildMessage: Ref<string>,
  projectName: string,
) {
  buildMessage.value = "";

  const listener = (event: any, message: string) => {
    buildMessage.value = message.replace(/\r?\n/g, "<br>") + "<br>";
  };
  window.ipcRenderer.on(
    `${projectName}-${ListenerEvent.BUILD_OUTPUT}`,
    listener,
  );
}
