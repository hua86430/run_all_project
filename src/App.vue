<script setup lang="ts">
import { getMessage } from "./composables/GetMessage";
import { LogRequest } from "./classes/logRequest";
import { RunProjectRequest } from "./classes/RunProjectRequest";

async function buildAndRun() {
  const csprojFilePath =
    "D:/MyProject/Run_All_Project_Application/Run_All_Project_Application/Run_All_Project_Application/Run_All_Project_Application.csproj";
  const projectName = "Run_All_Project_Application";

  const newVar = await window.ipcRenderer.invoke(
    "build-and-run",
    new RunProjectRequest(projectName, csprojFilePath),
  );
  console.log(newVar);
}

async function showLogs() {
  console.log(
    await getMessage(new LogRequest("info", "C:/logs/log-error.txt")),
  );
}
</script>

<template>
  <div>
    <button title="click me" @click="showLogs">click me to show log</button>
    <button title="click me" @click="buildAndRun">build and run</button>
  </div>
</template>

<style></style>
