import { ProcessStage } from "../enums/processStage";
import { ListenerEvent } from "../enums/ListenerEvent";
import { SyncProcessStatus } from "../enums/syncProcessStatus";

export class SyncProcessStatusRequest {
  projectName: string;
  stage: ProcessStage;
  status: SyncProcessStatus;
  message: string;

  constructor(
    projectName: string,
    stage: ProcessStage,
    status: SyncProcessStatus,
    message?: string,
  ) {
    this.projectName = projectName;
    this.stage = stage;
    this.status = status;
    this.message = message;
  }

  get listenProcessStatusChannel(): string {
    return `${this.projectName}-${ListenerEvent.PROCESS_STATUS}`;
  }
}
