import path from "node:path";
import fs from "node:fs";
import { app } from "electron";

export const useLogger = {
  info: (logMessage: string) => writeLog("info", logMessage),
  warning: (logMessage: string) => writeLog("warning", logMessage),
  error: (logMessage: string) => writeLog("error", logMessage),
};

function writeLog(logLevel: "info" | "warning" | "error", logMessage: string) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const logDir = path.join("C:/logs", app.getName());
  const logFile = path.join(
    logDir,
    `${year}-${month}-${day}-log-${logLevel}.log`,
  );

  try {
    fs.mkdir(logDir, { recursive: true }, (mkdirError) => {
      const errorMessage = `[${logLevel.toUpperCase()}][${new Date().toISOString()}] ${logMessage}\n`;
      fs.appendFile(logFile, errorMessage, (appendError) => {
        if (appendError) {
          console.error("Failed to append log:", appendError);
        }
      });
    });
  } catch (writeError) {
    console.error("Failed to write log:", writeError);
  }
}
