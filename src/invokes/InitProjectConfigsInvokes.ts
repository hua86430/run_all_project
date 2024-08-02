import { ProjectConfig } from "../classes/ProjectConfig";
import { SendInvoke } from "../composables/SendInvoke";

export const initProjectConfigs = async (): Promise<ProjectConfig[]> => {
  const response = await SendInvoke<ProjectConfig[]>("get-project-configs");
  return response.data;
};
