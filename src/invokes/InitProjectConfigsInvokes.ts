import { ProjectConfig } from "../classes/ProjectConfig";
import { SendInvoke } from "../composables/SendInvoke";
import { InvokeEvent } from "../enums/InvokeEvent";

export const initProjectConfigs = async (): Promise<ProjectConfig[]> => {
  const response = await SendInvoke<ProjectConfig[]>(
    InvokeEvent.GET_PROJECT_CONFIGS,
  );
  return response.data;
};
