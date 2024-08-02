import { RunProjectRequest } from "../classes/RunProjectRequest";
import { CsprojFileObject } from "../classes/CsprojFileObject";
import { InvokeRequest } from "./InvokeRequest";

export async function buildAndRunProject(csprojFileObject: CsprojFileObject) {
  const response = await InvokeRequest(
    "build-and-run",
    new RunProjectRequest(
      csprojFileObject.projectName,
      csprojFileObject.filePath,
    ),
  );

  console.log(response);
}
