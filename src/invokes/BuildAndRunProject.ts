import { SendInvoke } from "../composables/SendInvoke";
import { RunProjectRequest } from "../classes/RunProjectRequest";
import { ProjectConfig } from "../classes/ProjectConfig";
import { InvokeEvent } from "../enums/InvokeEvent";

export async function buildAndRunProject(csprojFileObject: ProjectConfig) {
  const response = await SendInvoke(
    InvokeEvent.BUILD_AND_RUN_PROJECT,
    new RunProjectRequest(
      csprojFileObject.projectName,
      csprojFileObject.csprojPath,
    ),
  );

  console.log(response);
}
