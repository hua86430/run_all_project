<script setup lang="ts">
import { getMessage } from "./composables/GetMessage";
import { LogRequest } from "./classes/logRequest";
import { ref } from "vue";
import { listenBuildProjectMessage } from "./composables/ListenBuildProjectMessage";
import { buildAndRunProject } from "./composables/BuildAndRunProject";

const buildMessage = ref("");
const logs = ref<string>("");

async function buildAndRun() {
  const csprojFilePath =
    "D:/MyProject/Run_All_Project_Application/Run_All_Project_Application/Run_All_Project_Application/Run_All_Project_Application.csproj";
  const projectName = "Run_All_Project_Application";

  listenBuildProjectMessage(buildMessage, projectName);
  await buildAndRunProject(projectName, csprojFilePath);
}

async function showLogs() {
  logs.value = await getMessage(
    new LogRequest("info", "C:/logs/log-error.txt"),
  );
}
</script>

<template>
  <div>
    <div>
      <button title="click me" @click="showLogs">click me to show log</button>
      <button title="click me" @click="buildAndRun">build and run</button>
    </div>

    <p v-if="logs" class="logs-section">Logs: <span v-html="logs"></span></p>
    <p v-if="buildMessage" class="build-logs-section">
      Build Message:
      <span v-html="buildMessage"></span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.logs-section,
.build-logs-section {
  text-align: left;
}
</style>
