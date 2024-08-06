import { ListenerResponse } from "../classes/ListenerResponse";
import { SyncProcessStatusResponse } from "../interfaces/syncProcessStatusResponse";
import { ListenerEvent } from "../enums/ListenerEvent";
import { Ref } from "vue";

export function ListenSubscribeProcessStatus(
  projectName: string,
  callback: (data: SyncProcessStatusResponse | undefined) => void,
) {
  const listener = (
    event: any,
    response: ListenerResponse<SyncProcessStatusResponse>,
  ) => {
    callback(response.data);
  };
  window.ipcRenderer.on(
    `${projectName}-${ListenerEvent.PROCESS_STATUS}`,
    listener,
  );
}
