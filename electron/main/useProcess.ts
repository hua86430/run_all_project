import psList from "ps-list";
import { syncProcessStatus } from "./handlers/processStatusHandler";
import { SyncProcessStatusRequest } from "../../src/classes/syncProcessStatusRequest";
import { ProcessStage } from "../../src/enums/processStage";
import { SyncProcessStatus } from "../../src/enums/syncProcessStatus";
import { exec } from "child_process";
import { promisify } from "util";
import findProcess from "find-process";

const execAsync = promisify(exec);

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

async function getProcessList() {
  return;
}
