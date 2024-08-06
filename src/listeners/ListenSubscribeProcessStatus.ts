import { ListenerResponse } from "../classes/ListenerResponse";
import { SyncProcessStatusResponse } from "../interfaces/syncProcessStatusResponse";
import { ListenerEvent } from "../enums/ListenerEvent";
import { Ref } from "vue";

export function ListenSubscribeProcessStatus(
  processStatus: Ref<SyncProcessStatusResponse>,
  projectName: string,
) {
  const listener = (
    event: any,
    response: ListenerResponse<SyncProcessStatusResponse>,
  ) => {
    if (processStatus.value && response.data) {
      processStatus.value = response.data;
      processStatus.value.message = response.data.message?.replace(
        /(\\r\\n|\\n|\\r)/g,
        "<br />",
      );
    }
  };
  window.ipcRenderer.on(
    `${projectName}-${ListenerEvent.PROCESS_STATUS}`,
    listener,
  );
}
