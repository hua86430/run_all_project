import { ipcMain } from "electron";
import { exec } from "child_process";
import { RunProjectRequest } from "../../src/classes/RunProjectRequest";

export function buildAndRunProject() {
  ipcMain.handle("build-and-run", async (event, request: RunProjectRequest) => {
    const buildCommand = `dotnet build "${request.csprojFilePath}"`;
    const runCommand = `dotnet run --project "${request.csprojFilePath}"`;

    try {
      await new Promise((resolve, reject) => {
        exec(buildCommand, (error, stdout, stderr) => {
          if (error) {
            event.sender.send(
              `${request.projectName}-build-output`,
              `Build error: ${error.message}`,
            );
            reject(error);
          }
          if (stderr) {
            event.sender.send(
              `${request.projectName}-build-output`,
              `Build stderr: ${stderr}`,
            );
            reject(stderr);
          }
          event.sender.send(
            `${request.projectName}-build-output`,
            `Build stdout: ${stdout}`,
          );
          resolve(stdout);
        });
      });
    } catch (error) {
      return error;
    }
  });
}
