import { exec, spawn } from "child_process";
import { promisify } from "util";
import { RunProjectRequest } from "../../../src/classes/RunProjectRequest";
import { getExistProjectByName, killProcessByName } from "../useProcess";
import chokidar from "chokidar";
import path from "node:path";
import { RunProjectProcessingDto } from "../../../src/classes/RunProjectProcessingDto";
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { syncProcessStatus } from "./processStatusHandler";
import { SyncProcessStatusRequest } from "../../../src/classes/syncProcessStatusRequest";
import { ProcessStage } from "../../../src/enums/processStage";
import { SyncProcessStatus } from "../../../src/enums/syncProcessStatus";
import { useHandler } from "./useHandler";

const execAsync = promisify(exec);
let electronEvent: Electron.IpcMainInvokeEvent;
let runProjectRequestDto: RunProjectProcessingDto;

export function buildAndRunProjectHandler(): void {
  useHandler(
    InvokeEvent.BUILD_AND_RUN_PROJECT,
    async (event, request: RunProjectRequest): Promise<InvokeResponse> => {
      electronEvent = event;
      runProjectRequestDto = new RunProjectProcessingDto(request);

      await killProcessByName(request.projectName);
      await buildProject();
      await runProject();
      await watchForChanges();

      return InvokeResponse.success("Build and run successful");
    },
  );
}

async function buildProject() {
  const buildCommand = `dotnet build "${runProjectRequestDto.csprojFilePath}"`;
  try {
    syncProcessStatus(
      new SyncProcessStatusRequest(
        runProjectRequestDto.projectName,
        ProcessStage.BUILDING,
        SyncProcessStatus.SUCCESS,
      ),
    );
    const { stdout, stderr } = await execAsync(buildCommand);
    electronEvent.sender.send(
      runProjectRequestDto.buildEventChannel,
      `Build stdout: ${stdout}`,
    );
    if (stderr) {
      electronEvent.sender.send(
        runProjectRequestDto.buildEventChannel,
        `,Build stderr: ${stderr}`,
      );

      syncProcessStatus(
        new SyncProcessStatusRequest(
          runProjectRequestDto.projectName,
          ProcessStage.BUILDING,
          SyncProcessStatus.ERROR,
        ),
      );
    }
  } catch (error) {
    electronEvent.sender.send(
      runProjectRequestDto.buildEventChannel,
      `Build error: ${error.message}`,
    );

    syncProcessStatus(
      new SyncProcessStatusRequest(
        runProjectRequestDto.projectName,
        ProcessStage.BUILDING,
        SyncProcessStatus.ERROR,
      ),
    );
    throw error;
  }
}

function runProject() {
  return new Promise<void>((resolve, reject) => {
    const runProcess = spawn("dotnet", [
      "run",
      "--project",
      runProjectRequestDto.csprojFilePath,
      "--started-by=electron",
    ]);

    runProcess.unref(); // Ensure the parent process does not wait for this process to exit

    runProcess.on("error", (error) => {
      electronEvent.sender.send(
        runProjectRequestDto.runEventChannel,
        `Run error: ${error.message}`,
      );
      reject(error);
    });

    electronEvent.sender.send(
      runProjectRequestDto.runEventChannel,
      `Run Success: Process ID: ${runProcess.pid}`,
    );

    syncProcessStatus(
      new SyncProcessStatusRequest(
        runProjectRequestDto.projectName,
        ProcessStage.RUNNING,
        SyncProcessStatus.SUCCESS,
        `Process ID: ${runProcess.pid}`,
      ),
    );

    resolve(); // Resolve immediately to allow the function to return
  });
}

async function watchForChanges() {
  const watcher = chokidar.watch(
    path.dirname(runProjectRequestDto.csprojFilePath),
    {
      persistent: true,
      ignored: /node_modules|\.git/,
      ignoreInitial: true,
    },
  );
  watcher.on("change", async (filePath: string) => {
    const existProcessByElectron = await getExistProjectByName(
      runProjectRequestDto.projectName,
      true,
    );

    if (!existProcessByElectron) {
      return;
    }

    electronEvent.sender.send(
      runProjectRequestDto.watchEventChannel,
      `File ${filePath} has been changed. Rebuilding...`,
    );
    await killProcessByName(runProjectRequestDto.projectName);
    await buildProject();
    await runProject();
  });
}
