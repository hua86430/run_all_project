import { ipcMain } from "electron";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import { RunProjectRequest } from "../../src/classes/RunProjectRequest";
import { killExistProcess } from "./killExistProcess";

const execAsync = promisify(exec);

export function buildAndRunProject() {
  ipcMain.handle("build-and-run", async (event, request: RunProjectRequest) => {
    const buildCommand = `dotnet build "${request.csprojFilePath}"`;

    async function buildProject() {
      try {
        const { stdout, stderr } = await execAsync(buildCommand);
        event.sender.send(
          `${request.projectName}-build-output`,
          `Build stdout: ${stdout}`,
        );
        if (stderr) {
          event.sender.send(
            `${request.projectName}-build-output`,
            `Build stderr: ${stderr}`,
          );
        }
      } catch (error) {
        event.sender.send(
          `${request.projectName}-build-output`,
          `Build error: ${error.message}`,
        );
        throw error;
      }
    }

    function runProject() {
      return new Promise<void>((resolve, reject) => {
        const runProcess = spawn("dotnet", [
          "run",
          "--project",
          request.csprojFilePath,
        ]);

        runProcess.unref(); // Ensure the parent process does not wait for this process to exit

        runProcess.on("error", (error) => {
          event.sender.send(
            `${request.projectName}-run-output`,
            `Run error: ${error.message}`,
          );
          reject(error);
        });

        event.sender.send(
          `${request.projectName}-run-output`,
          `Run Success: Process ID: ${runProcess.pid}`,
        );
        resolve(); // Resolve immediately to allow the function to return
      });
    }

    try {
      await killExistProcess(request.projectName, event);
      await buildProject();
      await runProject();
      return { success: true, message: "Build and run successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });
}
