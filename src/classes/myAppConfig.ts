import { App } from "electron";

export class MyAppConfig {
  version: string;

  constructor(app: App) {
    this.version = app.getVersion();
  }
}
