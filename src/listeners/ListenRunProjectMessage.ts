import { Ref } from "vue";

export function listenRunProjectMessage(
  runMessage: Ref<string>,
  projectName: string,
) {
  runMessage.value = "";

  const listener = (event: any, message: string) => {
    runMessage.value = message.replace(/\r?\n/g, "<br>") + "<br>";
  };
  window.ipcRenderer.on(`${projectName}-run-output`, listener);
}
