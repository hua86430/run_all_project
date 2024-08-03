import { ipcMain } from "electron";
import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { getProjectConfigs } from "../useProjectConfig";
import { ProjectConfig } from "../../../src/classes/ProjectConfig";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";

export function getProjectConfigsHandler() {
  ipcMain.handle(
    InvokeEvent.GET_PROJECT_CONFIGS,
    async (): Promise<InvokeResponse> => {
      let projectConfigs = getProjectConfigs();

      return InvokeResponse.successWithData<ProjectConfig[]>(
        "Get Project Configs Success",
        projectConfigs,
      );
    },
  );
}
