import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { ProjectConfig } from "../../src/classes/ProjectConfig";
import { ApplicationConfigPath } from "../../src/enums/applicationConfigPath";
import { MyAppConfig } from "../../src/classes/myAppConfig";
import { app, App } from "electron";
import { ApplicationConfigType } from "../../src/enums/applicationConfigType";

const configDir = path.join(os.homedir(), "AppData", "Local", "RunDotNetApp");
const projectConfigPath = path.join(
  configDir,
  ApplicationConfigPath.ProjectConfig,
);
const appConfigPath = path.join(configDir, ApplicationConfigPath.AppConfig);

function createDefaultConfig(path: string) {
  const defaultConfig = path === projectConfigPath ? [] : new MyAppConfig(app);
  fs.writeFile(path, JSON.stringify(defaultConfig, null, 2), (writeErr) => {
    if (writeErr) {
      console.error("An error occurred creating the file:", writeErr);
      return;
    }
  });
}

function ensureConfigDirectoryExists(callback: () => void) {
  fs.mkdir(configDir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error("An error occurred creating the directory:", mkdirErr);
      return;
    }
    callback();
  });
}

function readConfigFile(configPath: string) {
  fs.readFile(configPath, "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        ensureConfigDirectoryExists(() => createDefaultConfig(configPath));
      } else {
        console.error("An error occurred reading the file:", err);
      }
      return;
    }
  });
}
export function initProjectConfigFile() {
  readConfigFile(projectConfigPath);
  readConfigFile(appConfigPath);
}

export function saveConfig<TFileType, ApplicationConfigType>(
  config: TFileType,
  type: ApplicationConfigType,
) {
  const path =
    type === ApplicationConfigType.Project ? projectConfigPath : appConfigPath;

  ensureConfigDirectoryExists(() => {
    fs.writeFile(path, JSON.stringify(config, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("An error occurred creating the file:", writeErr);
        return;
      }
    });
  });
}

export function getProjectConfigs(): ProjectConfig[] {
  try {
    const data = fs.readFileSync(projectConfigPath, "utf-8");
    if (!Boolean(data)) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("An error occurred reading the file:", err);
  }
}

export function getAppConfig(): MyAppConfig {
  try {
    const data = fs.readFileSync(appConfigPath, "utf-8");
    if (!Boolean(data)) {
      return new MyAppConfig(app);
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("An error occurred reading the file:", err);
  }
}
