import psList from "ps-list";
import { syncProcessStatus } from "./handlers/processStatusHandler";
import { SyncProcessStatusRequest } from "../../src/classes/syncProcessStatusRequest";
import { ProcessStage } from "../../src/enums/processStage";
import { SyncProcessStatus } from "../../src/enums/syncProcessStatus";

export async function getExistProjectByName(projectName: string) {
  const processList = await psList();
  return processList.find((process) => process.name === `${projectName}.exe`);
}

export async function killProcessByName(projectName: string) {
  const existingProcess = await getExistProjectByName(projectName);

  if (existingProcess) {
    process.kill(existingProcess.pid);
  } else {
    console.log(`${projectName} not running`);
  }

  syncProcessStatus(
    new SyncProcessStatusRequest(
      projectName,
      ProcessStage.NOT_RUNNING,
      SyncProcessStatus.SUCCESS,
    ),
  );
}
