import { SendInvoke } from "../composables/SendInvoke";
import _ from "lodash";
import { ProjectConfig } from "../classes/ProjectConfig";
import { InvokeEvent } from "../enums/InvokeEvent";

export const saveProjectConfig = async (
  projectConfigs: ProjectConfig[],
): Promise<void> => {
  await SendInvoke(
    InvokeEvent.SAVE_PROJECT_CONFIG,
    _.cloneDeep(projectConfigs),
  );
};
