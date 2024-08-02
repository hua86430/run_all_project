import { CsprojFileObject } from "../classes/CsprojFileObject";
import { SendInvoke } from "../composables/SendInvoke";
import { RunProjectRequest } from "../classes/RunProjectRequest";

export async function buildAndRunProject(csprojFileObject: CsprojFileObject) {
  const response = await SendInvoke(
    "build-and-run",
    new RunProjectRequest(
      csprojFileObject.projectName,
      csprojFileObject.filePath,
    ),
  );

  console.log(response);
}
