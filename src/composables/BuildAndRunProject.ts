import { RunProjectRequest } from "../classes/RunProjectRequest";

export async function buildAndRunProject(
  projectName: string,
  csprojFilePath: string,
) {
  await window.ipcRenderer.invoke(
    "build-and-run",
    new RunProjectRequest(projectName, csprojFilePath),
  );
}
