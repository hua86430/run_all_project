import { ProcessStage } from "../enums/processStage";
import { SyncProcessStatus } from "../enums/syncProcessStatus";

export interface SyncProcessStatusResponse {
  projectName: string;
  stage: ProcessStage;
  status: SyncProcessStatus;
  message?: string;
}
