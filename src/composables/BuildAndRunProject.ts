import { RunProjectRequest } from "../classes/RunProjectRequest";
import { CsprojFileObject } from "../classes/CsprojFileObject";
import { SendInvoke } from "./SendInvoke";

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
