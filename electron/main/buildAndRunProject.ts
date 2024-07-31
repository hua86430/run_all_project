import { ipcMain } from "electron";
import { exec } from "child_process";
import { RunProjectRequest } from "../../src/classes/RunProjectRequest";

export function buildAndRunProject() {
  ipcMain.handle("build-and-run", async (event, request: RunProjectRequest) => {
    const buildCommand = `dotnet build "${request.csprojFilePath}"`;
    const runCommand = `dotnet run --project "${request.csprojFilePath}"`;

    function buildProject(
      reject: (reason?: any) => void,
      resolve: (value: PromiseLike<unknown> | unknown) => void,
    ) {
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
    }

    function runProject(
      reject: (reason?: any) => void,
      resolve: (value: PromiseLike<unknown> | unknown) => void,
    ) {
      exec(runCommand, (error, stdout, stderr) => {
        if (error) {
          event.sender.send(
            `${request.projectName}run-output`,
            `Run error: ${error.message}`,
          );
          reject(error);
          return;
        }
        if (stderr) {
          event.sender.send(
            `${request.projectName}run-output`,
            `Run stderr: ${stderr}`,
          );

          reject(stderr);
          return;
        }
        event.sender.send(
          `${request.projectName}run-output`,
          `Run stdout: ${stdout}`,
        );
        resolve(stdout);
      });
    }

    try {
      await new Promise((resolve, reject) => {
        buildProject(reject, resolve);
        runProject(reject, resolve);
      });
    } catch (error) {
      return error;
    }
  });
}
