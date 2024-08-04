import { ListenerResponse } from "../classes/ListenerResponse";
import { SyncProcessStatusResponse } from "../interfaces/syncProcessStatusResponse";
import { ListenerEvent } from "../enums/ListenerEvent";
import { Ref } from "vue";

export function ListenSubscribeProcessStatus(
  processStatus: Ref<SyncProcessStatusResponse | undefined>,
  projectName: string,
) {
  const listener = (
    event: any,
    response: ListenerResponse<SyncProcessStatusResponse>,
  ) => {
    processStatus.value = response.data;
  };
  window.ipcRenderer.on(
    `${projectName}-${ListenerEvent.PROCESS_STATUS}`,
    listener,
  );
}
