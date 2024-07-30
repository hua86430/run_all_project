export class RunProjectRequest {
  projectName: string;
  csprojFilePath: string;

  constructor(projectName: string, csprojFilePath: string) {
    this.projectName = projectName;
    this.csprojFilePath = csprojFilePath;
  }
}
