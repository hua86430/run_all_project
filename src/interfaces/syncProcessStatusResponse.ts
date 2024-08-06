import { ProcessStage } from "../enums/processStage";
import { SyncProcessStatus } from "../enums/syncProcessStatus";

export class SyncProcessStatusResponse {
  projectName: string = "";
  stage: ProcessStage = ProcessStage.UNKNOWN;
  status: SyncProcessStatus = SyncProcessStatus.UNKNOWN;
  message: string = "";
}
