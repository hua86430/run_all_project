import { ipcMain } from "electron";
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { getProjectConfigs } from "../useProjectConfig";
import { ProjectConfig } from "../../../src/classes/ProjectConfig";

export function getProjectConfigsHandler() {
  ipcMain.handle("get-project-configs", async (): Promise<InvokeResponse> => {
    let projectConfigs = getProjectConfigs();

    return InvokeResponse.successWithData<ProjectConfig[]>(
      "Get Project Configs Success",
      projectConfigs,
    );
  });
}
