import { CsprojFileObject } from "../classes/CsprojFileObject";
import { SendInvoke } from "../composables/SendInvoke";
import { RunProjectRequest } from "../classes/RunProjectRequest";
import { ProjectConfig } from "../classes/ProjectConfig";

export async function buildAndRunProject(csprojFileObject: ProjectConfig) {
  const response = await SendInvoke(
    "build-and-run",
    new RunProjectRequest(
      csprojFileObject.projectName,
      csprojFileObject.csprojPath,
    ),
  );

  console.log(response);
}
