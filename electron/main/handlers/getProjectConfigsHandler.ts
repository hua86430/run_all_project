import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { getProjectConfigs } from "../useProjectConfig";
import { ProjectConfig } from "../../../src/classes/ProjectConfig";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { useHandler } from "./useHandler";

export function getProjectConfigsHandler() {
  useHandler(
    InvokeEvent.GET_PROJECT_CONFIGS,
    async (): Promise<InvokeResponse> => {
      const projectConfigs = getProjectConfigs();

      return InvokeResponse.successWithData<ProjectConfig[]>(
        "Get Project Configs Success",
        projectConfigs,
      );
    },
  );
}
