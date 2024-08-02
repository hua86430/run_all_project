import path from "node:path";
import os from "node:os";
import fs from "node:fs";

function createDefaultConfig(
  configPath: string,
  windowInstance: Electron.CrossProcessExports.BrowserWindow,
) {
  const defaultConfig = {};
  fs.writeFile(
    configPath,
    JSON.stringify(defaultConfig, null, 2),
    (writeErr) => {
      if (writeErr) {
        console.error("An error occurred creating the file:", writeErr);
        return;
      }
      windowInstance.webContents.send(
        "file-content",
        JSON.stringify(defaultConfig, null, 2),
      );
    },
  );
}

function ensureConfigDirectoryExists(configDir: string, callback: () => void) {
  fs.mkdir(configDir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      console.error("An error occurred creating the directory:", mkdirErr);
      return;
    }
    callback();
  });
}

function readConfigFile(
  configPath: string,
  windowInstance: Electron.CrossProcessExports.BrowserWindow,
) {
  fs.readFile(configPath, "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        ensureConfigDirectoryExists(path.dirname(configPath), () =>
          createDefaultConfig(configPath, windowInstance),
        );
      } else {
        console.error("An error occurred reading the file:", err);
      }
      return;
    }
    windowInstance.webContents.send("file-content", data);
  });
}

export function checkConfigFileExist(
  windowInstance: Electron.CrossProcessExports.BrowserWindow,
) {
  const configDir = path.join(os.homedir(), "AppData", "Local", "RunDotNetApp");
  const configPath = path.join(configDir, "load-project-config.json");

  readConfigFile(configPath, windowInstance);
}
