import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { ProjectConfig } from "../../src/classes/ProjectConfig";

// import { app, BrowserWindow, ipcMain, screen, shell, Menu } from "electron";

const configDir = path.join(os.homedir(), "AppData", "Local", "RunDotNetApp");
const configPath = path.join(configDir, "load-project-config.json");

function createDefaultConfig() {
  const defaultConfig = [];
  fs.writeFile(
    configPath,
    JSON.stringify(defaultConfig, null, 2),
    (writeErr) => {
      if (writeErr) {
        console.error("An error occurred creating the file:", writeErr);
        return;
      }
    },
  );
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
        ensureConfigDirectoryExists(() => createDefaultConfig());
      } else {
        console.error("An error occurred reading the file:", err);
      }
      return;
    }
  });
}

export function initProjectConfigFile() {
  readConfigFile(configPath);
}

export function saveProjectConfigs(configs: ProjectConfig[]) {
  ensureConfigDirectoryExists(() => {
    fs.writeFile(configPath, JSON.stringify(configs, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("An error occurred creating the file:", writeErr);
        return;
      }
    });
  });
}

export function getProjectConfigs(): ProjectConfig[] {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    if (!Boolean(data)) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("An error occurred reading the file:", err);
  }
}
