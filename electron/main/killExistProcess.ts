import psList from "ps-list";

export async function killExistProcess(projectName: string) {
  const processList = await psList();
  const existingProcess = processList.find((process) =>
    process.name.includes(projectName),
  );

  if (existingProcess) {
    process.kill(existingProcess.pid);
  } else {
    console.log(`${projectName} not running`);
  }
}
