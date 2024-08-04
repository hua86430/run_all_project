import { SendInvoke } from "../composables/SendInvoke";
import { RunProjectRequest } from "../classes/RunProjectRequest";
import { ProjectConfig } from "../classes/ProjectConfig";
import { InvokeEvent } from "../enums/InvokeEvent";

export async function buildAndRunProject(csprojFileObject: ProjectConfig) {
  await SendInvoke(
    InvokeEvent.BUILD_AND_RUN_PROJECT,
    new RunProjectRequest(
      csprojFileObject.projectName,
      csprojFileObject.csprojPath,
    ),
  );
}

export async function multipleBuildAndRunProject(
  csprojFileObjects: ProjectConfig[],
) {
  const requests = csprojFileObjects.map(
    (csprojFileObject) =>
      new RunProjectRequest(
        csprojFileObject.projectName,
        csprojFileObject.csprojPath,
      ),
  );
  await SendInvoke(InvokeEvent.MULTIPLE_BUILD_AND_RUN_PROJECT, requests);
}
