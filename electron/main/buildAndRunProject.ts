import { ipcMain } from "electron";
import { exec } from "child_process";
import { promisify } from "util";
import psList from "ps-list";
import { RunProjectRequest } from "../../src/classes/RunProjectRequest";

const execAsync = promisify(exec);

export function buildAndRunProject() {
  ipcMain.handle("build-and-run", async (event, request: RunProjectRequest) => {
    const buildCommand = `dotnet build "${request.csprojFilePath}"`;
    const runCommand = `dotnet run --project "${request.csprojFilePath}"`;

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

    async function runProject() {
      try {
        console.log("Before execAsync runCommand");
        const { stdout, stderr } = await execAsync(runCommand);
        console.log("After execAsync runCommand");
        event.sender.send(
          `${request.projectName}-run-output`,
          `Run stdout: ${stdout}`,
        );
        if (stderr) {
          event.sender.send(
            `${request.projectName}-run-output`,
            `Run stderr: ${stderr}`,
          );
        }
      } catch (error) {
        event.sender.send(
          `${request.projectName}-run-output`,
          `Run error: ${error.message}`,
        );
        throw error;
      }
    }

    try {
      console.log("Starting buildProject");
      await buildProject();
      console.log("Finished buildProject");

      const processList = await psList();
      const existingProcess = processList.find((process) =>
        process.name.includes(request.projectName),
      );

      if (existingProcess) {
        process.kill(existingProcess.pid);
        event.sender.send(
          `${request.projectName}-run-output`,
          `Stopped existing process with PID: ${existingProcess.pid}`,
        );
      }

      console.log("Starting runProject");
      await runProject();
      console.log("Finished runProject");
      return { success: true, message: "Build and run successful" };
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: error.message };
    }
  });
}
