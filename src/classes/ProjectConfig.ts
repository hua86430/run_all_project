export class ProjectConfig {
  projectName: string;
  csprojPath: string;
  remark: string;

  constructor(projectName: string, csprojPath: string, remark?: string) {
    this.projectName = projectName;
    this.csprojPath = csprojPath;
    this.remark = remark || "";
  }
}
