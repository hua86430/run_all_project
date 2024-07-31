import { RunProjectRequest } from "./RunProjectRequest";

export class RunProjectProcessingDto {
  projectName: string;
  csprojFilePath: string;

  constructor(request: RunProjectRequest) {
    this.projectName = request.projectName;
    this.csprojFilePath = request.csprojFilePath;
  }

  get buildEventChannel(): string {
    return `${this.projectName}-build-output`;
  }

  get runEventChannel(): string {
    return `${this.projectName}-run-output`;
  }

  get watchEventChannel(): string {
    return `${this.projectName}-watch-output`;
  }
}
