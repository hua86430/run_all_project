import { SendInvoke } from "../composables/SendInvoke";
import _ from "lodash";
import { ProjectConfig } from "../classes/ProjectConfig";

export const saveProjectConfig = async (
  projectConfigs: ProjectConfig[],
): Promise<void> => {
  await SendInvoke("save-project-config", _.cloneDeep(projectConfigs));
};
