import { Ref } from "vue";

export function listenBuildProjectMessage(
  buildMessage: Ref<string>,
  projectName: string,
) {
  const listener = (event: any, message: string) => {
    buildMessage.value = message + "\n";
  };
  window.ipcRenderer.on(`${projectName}-build-output`, listener);
}
