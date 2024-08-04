import { RunProjectRequest } from "./RunProjectRequest";
import { ListenerEvent } from "../enums/ListenerEvent";

export class RunProjectProcessingDto {
  projectName: string;
  csprojFilePath: string;

  constructor(request: RunProjectRequest) {
    this.projectName = request.projectName;
    this.csprojFilePath = request.csprojFilePath;
  }

  get buildEventChannel(): string {
    return `${this.projectName}-${ListenerEvent.BUILD_OUTPUT}`;
  }

  get runEventChannel(): string {
    return `${this.projectName}-${ListenerEvent.RUN_OUTPUT}`;
  }

  get watchEventChannel(): string {
    return `${this.projectName}-${ListenerEvent.WATCH_OUTPUT}`;
  }
}
