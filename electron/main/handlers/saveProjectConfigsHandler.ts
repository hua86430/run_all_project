import { InvokeResponse } from "../../../src/classes/invokeResponse";
import { ProjectConfig } from "../../../src/classes/ProjectConfig";
import { saveConfig } from "../useProjectConfig";
import { InvokeEvent } from "../../../src/enums/InvokeEvent";
import { useHandler } from "./useHandler";
import { ApplicationConfigType } from "../../../src/enums/applicationConfigType";

export function SaveProjectConfigsHandler() {
  useHandler(
    InvokeEvent.SAVE_PROJECT_CONFIG,
    async (event, request: ProjectConfig[]): Promise<InvokeResponse> => {
      try {
        saveConfig<ProjectConfig[], ApplicationConfigType.Project>(
          request,
        );
        return InvokeResponse.success("Build and run successful");
      } catch (error) {
        return InvokeResponse.error(error.message);
      }
    },
  );
}
