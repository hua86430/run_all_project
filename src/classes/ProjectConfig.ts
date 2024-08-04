export class ProjectConfig {
  projectName: string;
  csprojPath: string;
  remark: string;
  isSelected: boolean;

  constructor(
    projectName: string,
    csprojPath: string,
    remark?: string,
    isSelected?: boolean,
  ) {
    this.projectName = projectName;
    this.csprojPath = csprojPath;
    this.remark = remark || "";
    this.isSelected = isSelected || false;
  }
}
