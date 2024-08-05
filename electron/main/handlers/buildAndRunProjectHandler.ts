import { exec, spawn } from "child_process";
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
import { promisify } from "util";
import { useLogger } from "../useLogger";

const execAsync = promisify(exec);
let electronEvent: Electron.IpcMainInvokeEvent;

async function doRunProject(request: RunProjectRequest) {
  const dto = new RunProjectProcessingDto(request);

  await killProcessByName(dto.projectName);
  await buildProject(dto);
  await runProject(dto);
  await watchForChanges(dto);
}

export function buildAndRunProjectHandler(): void {
  useHandler(
    InvokeEvent.BUILD_AND_RUN_PROJECT,
    async (event, request: RunProjectRequest): Promise<InvokeResponse> => {
      electronEvent = event;
      await doRunProject(request);

      return InvokeResponse.success("Build and run successful");
    },
  );
}

export function buildAndRunProjectHandlers(): void {
  useHandler(
    InvokeEvent.MULTIPLE_BUILD_AND_RUN_PROJECT,
    async (event, requests: RunProjectRequest[]): Promise<InvokeResponse> => {
      electronEvent = event;

      const tasks = requests.map(
        async (request: RunProjectRequest): Promise<void> => {
          return doRunProject(request);
        },
      );

      await Promise.all(tasks);

      return InvokeResponse.success("Build and run successful");
    },
  );
}

async function buildProject(dto: RunProjectProcessingDto) {
  const buildCommand = `dotnet build "${dto.csprojFilePath}"`;
  try {
    syncProcessStatus(
      new SyncProcessStatusRequest(
        dto.projectName,
        ProcessStage.BUILDING,
        SyncProcessStatus.SUCCESS,
      ),
    );
    const { stdout, stderr } = await execAsync(buildCommand);
    electronEvent.sender.send(dto.buildEventChannel, `Build stdout: ${stdout}`);
    if (stderr) {
      electronEvent.sender.send(
        dto.buildEventChannel,
        `,Build stderr: ${stderr}`,
      );

      syncProcessStatus(
        new SyncProcessStatusRequest(
          dto.projectName,
          ProcessStage.BUILDING,
          SyncProcessStatus.ERROR,
        ),
      );
    }
  } catch (error) {
    electronEvent.sender.send(
      dto.buildEventChannel,
      `Build error: ${error.message}`,
    );

    syncProcessStatus(
      new SyncProcessStatusRequest(
        dto.projectName,
        ProcessStage.BUILDING,
        SyncProcessStatus.ERROR,
      ),
    );
    throw error;
  }
}

function runProject(dto: RunProjectProcessingDto) {
  return new Promise<void>((resolve, reject) => {
    const runProcess = spawn("dotnet", [
      "run",
      "--project",
      dto.csprojFilePath,
      "--started-by=electron",
    ]);

    runProcess.unref(); // Ensure the parent process does not wait for this process to exit

    runProcess.on("error", (error) => {
      electronEvent.sender.send(
        dto.runEventChannel,
        `Run error: ${error.message}`,
      );
      reject(error);
    });

    electronEvent.sender.send(
      dto.runEventChannel,
      `Run Success: Process ID: ${runProcess.pid}`,
    );

    syncProcessStatus(
      new SyncProcessStatusRequest(
        dto.projectName,
        ProcessStage.RUNNING,
        SyncProcessStatus.SUCCESS,
        `Process ID: ${runProcess.pid}`,
      ),
    );

    resolve();
  });
}

let debounceTimer: NodeJS.Timeout;
async function watchForChanges(dto: RunProjectProcessingDto) {
  const gitTrackedFiles = (
    await execAsync("git ls-files", {
      cwd: path.dirname(dto.csprojFilePath),
      encoding: "utf-8",
    })
  ).stdout
    .split("\n")
    .filter(Boolean)
    .map((filePath) =>
      path.resolve(path.dirname(dto.csprojFilePath), filePath),
    );

  const watcher = chokidar.watch(gitTrackedFiles, {
    persistent: true,
    ignored: /node_modules|\.git|bin|obj/,
    ignoreInitial: true,
  });

  watcher.on("change", async (filePath: string) => {
    useLogger.info(
      `FileWatcher: Application: ${dto.projectName}, File: ${filePath}`,
    );
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      const existProcessByElectron = await getExistProjectByName(
        dto.projectName,
        true,
      );

      if (!existProcessByElectron) {
        return;
      }

      electronEvent.sender.send(
        dto.watchEventChannel,
        `File ${filePath} has been changed. Rebuilding...`,
      );
      await killProcessByName(dto.projectName);
      await buildProject(dto);
      await runProject(dto);
    }, 1000);
  });
}
