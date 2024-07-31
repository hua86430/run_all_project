import psList from "ps-list";

export async function killExistProcess(
  projectName: string,
  event: Electron.IpcMainInvokeEvent,
) {
  const processList = await psList();
  const existingProcess = processList.find((process) =>
    process.name.includes(projectName),
  );

  if (existingProcess) {
    process.kill(existingProcess.pid);
  }
}
