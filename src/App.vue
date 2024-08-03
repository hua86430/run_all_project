<script setup lang="ts">
import { LogRequest } from "./classes/logRequest";
import { onMounted, ref } from "vue";
import { ProjectConfig } from "./classes/ProjectConfig";
import { initProjectConfigs } from "./invokes/InitProjectConfigsInvokes";
import { listenBuildProjectMessage } from "./listeners/ListenBuildProjectMessage";
import { listenRunProjectMessage } from "./listeners/ListenRunProjectMessage";
import { buildAndRunProject } from "./invokes/BuildAndRunProject";
import { getMessage } from "./invokes/GetMessage";
import { saveProjectConfig } from "./invokes/SaveProjectConfigInvokes";
import UploadCsprojFile from "./UploadCsprojFile.vue";
import KillProcessButton from "./KillProcessButton.vue";
import BuildAndRunProjectButton from "./BuildAndRunProjectButton.vue";

const logs = ref<string>("");
const projectConfigs = ref<ProjectConfig[]>([]);

onMounted(async () => {
  projectConfigs.value = await initProjectConfigs();
});

async function showLogs() {
  logs.value = await getMessage(
    new LogRequest("info", "C:/logs/log-error.txt"),
  );
}
</script>

<template>
  <div>
    <div>
      <UploadCsprojFile v-model:project-configs="projectConfigs" />
      <el-button type="warning" @click="saveProjectConfig(projectConfigs)"
        >Save</el-button
      >
    </div>
    <div v-for="(project, index) in projectConfigs" :key="project.projectName">
      {{ project.projectName }}
      <!--      <el-button type="primary" @click="showLogs"-->
      <!--        >click me to show log</el-button-->
      <!--      >-->
      <BuildAndRunProjectButton :project="project" />
      <KillProcessButton :project="project" />
    </div>

    <p v-if="logs" class="logs-section">Logs: <span v-html="logs"></span></p>
  </div>
</template>

<style lang="scss" scoped>
.logs-section,
.build-logs-section {
  text-align: left;
}
</style>
