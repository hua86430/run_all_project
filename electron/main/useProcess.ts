import { syncProcessStatus } from "./handlers/processStatusHandler";
import { SyncProcessStatusRequest } from "../../src/classes/syncProcessStatusRequest";
import { ProcessStage } from "../../src/enums/processStage";
import { SyncProcessStatus } from "../../src/enums/syncProcessStatus";
import findProcess from "find-process";

export async function getExistProjectByName(
  projectName: string,
  startByElectron: boolean = false,
) {
  const existProcess = (await findProcess("name", projectName)).find(
    (x) => x.name === `${projectName}.exe`,
  );

  if (
    existProcess &&
    startByElectron &&
    !existProcess.cmd.includes("--started-by=electron")
  ) {
    return null;
  }

  return existProcess;
}

export async function killProcessByName(projectName: string) {
  syncProcessStatus(
    new SyncProcessStatusRequest(
      projectName,
      ProcessStage.KILLING_EXISTING_PROCESS,
      SyncProcessStatus.SUCCESS,
    ),
  );
  const existingProcess = await getExistProjectByName(projectName);

  if (existingProcess) {
    process.kill(existingProcess.pid);
  }

  syncProcessStatus(
    new SyncProcessStatusRequest(
      projectName,
      ProcessStage.NOT_RUNNING,
      SyncProcessStatus.SUCCESS,
    ),
  );
}

async function getProcessList() {
  return;
}
