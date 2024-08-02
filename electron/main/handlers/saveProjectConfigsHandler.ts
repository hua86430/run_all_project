import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { ipcMain } from "electron";
import { ProjectConfig } from "../../../src/classes/ProjectConfig";
import { saveProjectConfigs } from "../useProjectConfig";

export function SaveProjectConfigsHandler() {
  ipcMain.handle(
    "save-project-config",
    async (event, request: ProjectConfig[]): Promise<InvokeResponse> => {
      try {
        saveProjectConfigs(request);
        return InvokeResponse.success("Build and run successful");
      } catch (error) {
        return InvokeResponse.error(error.message);
      }
    },
  );
}
