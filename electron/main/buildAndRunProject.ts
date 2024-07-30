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
            console.error(`Build error: ${error.message}`);
            event.sender.send("build-output", `Build error: ${error.message}`);
            reject(error);
          }
          if (stderr) {
            console.error(`Build stderr: ${stderr}`);
            event.sender.send("build-output", `Build stderr: ${stderr}`);
            reject(stderr);
          }
          console.log(`Build stdout: ${stdout}`);
          event.sender.send("build-output", `Build stdout: ${stdout}`);
          resolve(stdout);
        });
      });
    } catch (error) {
      return error;
    }
  });
}
