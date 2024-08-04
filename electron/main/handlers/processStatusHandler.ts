import { ipcMain } from "electron";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { ListenerResponse } from "../../../src/classes/ListenerResponse";
import { SyncProcessStatusResponse } from "../../../src/interfaces/syncProcessStatusResponse";
import { SyncProcessStatusRequest } from "../../../src/classes/syncProcessStatusRequest";
import { SyncProcessStatus } from "../../../src/enums/syncProcessStatus";
import { getExistProjectByName } from "../useProcess";
import { ProcessStage } from "../../../src/enums/processStage";

let electronEvent: Electron.IpcMainInvokeEvent;

export function processStatusHandler(): void {
  ipcMain.handle(
    InvokeEvent.SUBSCRIBE_PROCESS_STATUS,
    async (event, projectName: string) => {
      electronEvent = event;

      const existingProcess = await getExistProjectByName(projectName, true);
      syncProcessStatus(
        new SyncProcessStatusRequest(
          projectName,
          existingProcess ? ProcessStage.RUNNING : ProcessStage.NOT_RUNNING,
          SyncProcessStatus.SUCCESS,
          existingProcess ? `Process ID: ${existingProcess.ppid}` : null,
        ),
      );

      return InvokeResponse.success("Subscribed to process status");
    },
  );
}

export function syncProcessStatus(request: SyncProcessStatusRequest) {
  const args =
    request.status === SyncProcessStatus.SUCCESS
      ? ListenerResponse.successWithData<SyncProcessStatusResponse>(
          "Sync process success",
          {
            projectName: request.projectName,
            stage: request.stage,
            status: SyncProcessStatus.SUCCESS,
            message: request.message,
          },
        )
      : ListenerResponse.errorWithData<SyncProcessStatusResponse>(
          "Sync process error",
          {
            projectName: request.projectName,
            stage: request.stage,
            status: SyncProcessStatus.ERROR,
          },
        );

  electronEvent.sender.send(request.listenProcessStatusChannel, args);
}
