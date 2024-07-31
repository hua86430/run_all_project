import { RunProjectRequest } from "../classes/RunProjectRequest";
import { CsprojFileObject } from "../classes/CsprojFileObject";

export async function buildAndRunProject(csprojFileObject: CsprojFileObject) {
  console.log(csprojFileObject);
  await window.ipcRenderer.invoke(
    "build-and-run",
    new RunProjectRequest(
      csprojFileObject.projectName,
      csprojFileObject.filePath,
    ),
  );
}
